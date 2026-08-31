import ai from "../config/connection.js";
import Embedding from "../models/embedding_model.js";
import ApiError from "../utils/ApiError.js";

// ─── Text Extraction ────────────────────────────────────────────────────────

/**
 * Recursively extracts plain text from a TipTap/ProseMirror JSON node.
 */
export function extractText(node) {
  if (!node) return "";
  let text = "";
  if (node.text) text += node.text;
  if (node.content) {
    for (const child of node.content) {
      text += extractText(child);
    }
  }
  // Add newline after block-level nodes so chunks don't bleed together
  if (["paragraph", "heading", "listItem", "blockquote", "codeBlock"].includes(node.type)) {
    text += "\n";
  }
  return text;
}

// ─── Chunking ────────────────────────────────────────────────────────────────

const CHUNK_SIZE = 400;       // target tokens (≈ characters / 4)
const CHUNK_OVERLAP = 80;     // overlap between consecutive chunks

/**
 * Splits a long text into overlapping chunks.
 * Uses sentence boundaries where possible.
 */
export function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 0);

  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());

      // Start next chunk with overlap
      const words = current.split(" ");
      const overlapWords = words.slice(-Math.floor(overlap / 5)); // rough word count
      current = overlapWords.join(" ") + " " + sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }

  if (current.trim().length > 0) chunks.push(current.trim());
  return chunks;
}

/**
 * Extracts blocks from a TipTap doc and returns text chunks with metadata.
 */
export function getTextChunks(doc) {
  if (!doc || !doc.content) return [];

  const fullText = doc.content
    .map(node => extractText(node))
    .join("\n")
    .trim();

  if (!fullText) return [];

  return chunkText(fullText).map((text, index) => ({
    chunkIndex: index,
    text,
  }));
}

// ─── Embedding Generation ─────────────────────────────────────────────────────

/**
 * Generates embeddings for an array of text chunks using Gemini.
 * Returns [{chunkIndex, text, embedding}]
 */
export async function generateEmbeddings(chunks) {
  if (!chunks.length) return [];

  try {
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await ai.models.embedContent({
          model: "text-embedding-004",
          content: chunk.text,
        });
        return {
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          embedding: response.embedding.values,
        };
      })
    );
    return results;
  } catch (error) {
    throw new ApiError(500, `Failed to generate embeddings: ${error.message}`);
  }
}

// ─── Embedding Storage ────────────────────────────────────────────────────────

/**
 * Indexes a note: extracts chunks, generates embeddings, stores in MongoDB.
 * Replaces any existing embeddings for this note.
 */
export async function indexNote(noteId, userId, doc) {
  const chunks = getTextChunks(doc);
  if (!chunks.length) return { indexed: 0 };

  const chunksWithEmbeddings = await generateEmbeddings(chunks);

  // Delete stale embeddings
  await Embedding.deleteMany({ noteId, userId });

  const docs = chunksWithEmbeddings.map(({ chunkIndex, text, embedding }) => ({
    noteId,
    userId,
    chunkIndex,
    text,
    embedding,
  }));

  await Embedding.insertMany(docs);
  return { indexed: docs.length };
}

/**
 * Removes all embeddings for a note (call on note delete).
 */
export async function deleteNoteIndex(noteId, userId) {
  await Embedding.deleteMany({ noteId, userId });
}

// ─── Vector Search ────────────────────────────────────────────────────────────

/**
 * Cosine similarity between two equal-length vectors.
 */
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieves the top-k most relevant chunks for a query.
 *
 * @param {string} query        - User's question / prompt
 * @param {string} userId       - Scope search to this user
 * @param {string|string[]} noteId - One noteId or array of noteIds (optional)
 * @param {number} topK         - Number of chunks to return (default 5)
 */
export async function retrieveRelevantChunks(query, userId, noteId = null, topK = 5) {
  // Embed the query
  const queryEmbedResponse = await ai.models.embedContent({
    model: "text-embedding-004",
    content: query,
  });
  const queryVec = queryEmbedResponse.embedding.values;

  // Fetch candidate embeddings from MongoDB
  const filter = { userId };
  if (noteId) {
    filter.noteId = Array.isArray(noteId) ? { $in: noteId } : noteId;
  }

  const candidates = await Embedding.find(filter).lean();
  if (!candidates.length) return [];

  // Score and sort
  const scored = candidates.map(c => ({
    ...c,
    score: cosineSimilarity(queryVec, c.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Builds a context string from retrieved chunks for prompt injection.
 */
export function buildContext(chunks) {
  return chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.text}`)
    .join("\n\n");
}