import ApiError from "../utils/ApiError.js";
import { Embedding } from "../models/embedding.model.js";
export const getTextBlocks = (doc) => {
  const blocks = [];

  doc.content.forEach((node) => {
    if (node.type === "paragraph" || node.type === "heading") {
      const text = extractText(node);

      if (text.trim()) {
        blocks.push({
          text,
        });
      }
    }
  });

  return blocks;
};

export function extractText(node) {
  let text = "";

  if (node.text) {
    text += node.text;
  }

  if (node.content) {
    for (const child of node.content) {
      text += extractText(child);
    }
  }

  return text;
}
export function getText(jsonDoc) {
  const blocks = getTextBlocks(jsonDoc);
  let text = "";
  blocks.forEach((block) => (text = text.concat(block.text)));
  return text;
}

export function getTextFromEmbedding(embeddings) {
  let text = "";

  embeddings.forEach((embedding) => {
    text = text.concat(embedding.chunkIndex + ". " + embedding.text + "\n");
  });
  return text;
}

import ai from "../GenAI/connection.js";
import mongoose from "mongoose";
export const generateEmbeddings = async (doc) => {
  try {
    const blocks = getTextBlocks(doc.content);
    if (!blocks.length) {
      return [];
    }
    const embeddings = await Promise.all(
      blocks.map(async (block, index) => {
        const response = await ai.embeddings.create({
          model: "text-embedding-3-small",
          input: block.text,
        });
        return {
          noteId: doc._id,
          userId: doc.userId,
          chunkIndex: index,
          text: block.text,
          embedding: response.data[0].embedding,
        };
      }),
    );
    return embeddings;
  } catch (error) {
    throw new ApiError(500, "Failed to generate embeddings");
  }
};

export const getRelevantEmbeddings = async (query, userId, noteId) => {
  try {
    const response = await ai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryVector = response.data[0].embedding;
    
    const noteEmbeddings = await Embedding.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 200,
          limit: 8,
          filter: {
            userId: new mongoose.Types.ObjectId(userId),
            noteId: new mongoose.Types.ObjectId(noteId),
          },
        },
      },
      {
        $project: {
          text: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);
    return noteEmbeddings;
  } catch (error) {
    console.error("Embedding search error:", error.message);
    throw new ApiError(500, "Unable to search embeddings");
  }
};

export const createUpdateEmbeddings = async (note, embeddings) => {
  try {
    const docs = await generateEmbeddings(note);
    if (!docs?.length)
      throw new ApiError(500, "Got empty embeddings from ai model");

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Embedding.deleteMany({ userId: note.userId, noteId: note._id });
      await Embedding.insertMany(docs);
      note.isIndexed = true;
      await note.save();
    });
    const embeddings = docs.map((doc) => doc.embedding);
    return embeddings;
  } catch (error) {
    throw error;
  }
};
