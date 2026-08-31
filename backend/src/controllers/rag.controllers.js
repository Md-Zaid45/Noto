import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";
import { Flashcard } from "../models/flashcard.model.js";
import Embedding from "../models/embedding_model.js";

import {
  indexNote,
  deleteNoteIndex,
  retrieveRelevantChunks,
  buildContext,
  getTextChunks,
  generateEmbeddings,
} from "../services/rag.js";

import {
  generateFlashcards,
  generateQuiz,
  summariseNote,
  answerQuestion,
  extractKeyConcepts,
} from "../services/ai_service.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getNoteOrThrow(noteId, userId) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new ApiError(404, "Note not found");
  return note;
}

/**
 * Ensures a note is indexed. Re-indexes if forced or no embeddings exist.
 */
async function ensureIndexed(note, force = false) {
  if (!force) {
    const count = await Embedding.countDocuments({ noteId: note._id, userId: note.userId });
    if (count > 0) return; // already indexed
  }
  await indexNote(note._id, note.userId, note.content);
}

// ─── Index / Re-index ─────────────────────────────────────────────────────────

/**
 * POST /rag/index/:noteId
 * Manually trigger (re)indexing of a note's embeddings.
 */
export const indexNoteHandler = asyncHandler(async (req, res) => {
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);
  const result = await indexNote(note._id, req.user._id, note.content);
  res.json(new ApiResponse(200, result, "Note indexed successfully"));
});

// ─── Flashcard Generation ─────────────────────────────────────────────────────

/**
 * POST /rag/flashcards/:noteId
 * Body: { count?: number, save?: boolean }
 *
 * Generates AI flashcards from a note using RAG.
 * If save=true, persists them to the Flashcard collection.
 */
export const generateFlashcardsHandler = asyncHandler(async (req, res) => {
  const { count = 10, save = false } = req.body;
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);

  await ensureIndexed(note);

  // Use the full note content as context for flashcard generation
  const chunks = await Embedding.find({ noteId: note._id, userId: req.user._id })
    .sort({ chunkIndex: 1 })
    .lean();

  if (!chunks.length) throw new ApiError(422, "Note has no indexable content");

  const context = chunks.map(c => c.text).join("\n\n");
  const flashcards = await generateFlashcards(context, count);

  let saved = [];
  if (save) {
    const docs = flashcards.map(f => ({
      userId: req.user._id,
      noteId: note._id,
      question: f.question,
      answer: f.answer,
    }));
    saved = await Flashcard.insertMany(docs);
  }

  res.json(
    new ApiResponse(
      200,
      { flashcards, saved: save ? saved.map(s => s._id) : [] },
      `Generated ${flashcards.length} flashcards${save ? " and saved to deck" : ""}`,
    ),
  );
});

// ─── Quiz Generation ──────────────────────────────────────────────────────────

/**
 * POST /rag/quiz/:noteId
 * Body: { count?: number }
 *
 * Returns a multiple-choice quiz grounded in the note.
 */
export const generateQuizHandler = asyncHandler(async (req, res) => {
  const { count = 5 } = req.body;
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);

  await ensureIndexed(note);

  const chunks = await Embedding.find({ noteId: note._id, userId: req.user._id })
    .sort({ chunkIndex: 1 })
    .lean();

  if (!chunks.length) throw new ApiError(422, "Note has no indexable content");

  const context = chunks.map(c => c.text).join("\n\n");
  const quiz = await generateQuiz(context, count);

  res.json(new ApiResponse(200, { quiz }, `Generated ${quiz.length}-question quiz`));
});

// ─── Summary ─────────────────────────────────────────────────────────────────

/**
 * POST /rag/summary/:noteId
 * Body: { style?: "brief" | "detailed" | "bullets" }
 *
 * Summarises the note.
 */
export const summariseNoteHandler = asyncHandler(async (req, res) => {
  const { style = "detailed" } = req.body;
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);

  await ensureIndexed(note);

  const chunks = await Embedding.find({ noteId: note._id, userId: req.user._id })
    .sort({ chunkIndex: 1 })
    .lean();

  if (!chunks.length) throw new ApiError(422, "Note has no indexable content");

  const context = chunks.map(c => c.text).join("\n\n");
  const summary = await summariseNote(context, style);

  res.json(new ApiResponse(200, { summary, style }, "Summary generated"));
});

// ─── QnA (RAG Chat) ──────────────────────────────────────────────────────────

/**
 * POST /rag/ask/:noteId
 * Body: { question: string, history?: [{role, text}], topK?: number }
 *
 * Answers a question grounded in the note using semantic search.
 */
export const askNoteHandler = asyncHandler(async (req, res) => {
  const { question, history = [], topK = 5 } = req.body;
  if (!question?.trim()) throw new ApiError(400, "question is required");

  const note = await getNoteOrThrow(req.params.noteId, req.user._id);
  await ensureIndexed(note);

  const relevantChunks = await retrieveRelevantChunks(
    question,
    req.user._id,
    note._id,
    topK,
  );

  if (!relevantChunks.length) {
    throw new ApiError(422, "No relevant content found in this note");
  }

  const context = buildContext(relevantChunks);
  const result = await answerQuestion(question, context, history);

  res.json(
    new ApiResponse(200, {
      ...result,
      sourceChunks: relevantChunks.map(c => ({
        chunkIndex: c.chunkIndex,
        score: c.score.toFixed(4),
        preview: c.text.slice(0, 120) + (c.text.length > 120 ? "…" : ""),
      })),
    }, "Answer generated"),
  );
});

/**
 * POST /rag/ask
 * Body: { question: string, noteIds?: string[], history?: [...], topK?: number }
 *
 * Cross-note QnA: searches across all of the user's notes (or a subset).
 */
export const askWorkspaceHandler = asyncHandler(async (req, res) => {
  const { question, noteIds = null, history = [], topK = 6 } = req.body;
  if (!question?.trim()) throw new ApiError(400, "question is required");

  const relevantChunks = await retrieveRelevantChunks(
    question,
    req.user._id,
    noteIds,
    topK,
  );

  if (!relevantChunks.length) {
    throw new ApiError(422, "No relevant content found in your notes");
  }

  const context = buildContext(relevantChunks);
  const result = await answerQuestion(question, context, history);

  // Enrich with note names for cross-note results
  const noteIdSet = [...new Set(relevantChunks.map(c => String(c.noteId)))];
  const notes = await Note.find({ _id: { $in: noteIdSet } }, "name").lean();
  const noteMap = Object.fromEntries(notes.map(n => [String(n._id), n.name]));

  res.json(
    new ApiResponse(200, {
      ...result,
      sourceChunks: relevantChunks.map(c => ({
        noteId: c.noteId,
        noteName: noteMap[String(c.noteId)] || "Unknown",
        chunkIndex: c.chunkIndex,
        score: c.score.toFixed(4),
        preview: c.text.slice(0, 120) + (c.text.length > 120 ? "…" : ""),
      })),
    }, "Answer generated"),
  );
});

// ─── Key Concepts ─────────────────────────────────────────────────────────────

/**
 * GET /rag/concepts/:noteId
 * Extracts key terms and definitions from a note.
 */
export const extractConceptsHandler = asyncHandler(async (req, res) => {
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);
  await ensureIndexed(note);

  const chunks = await Embedding.find({ noteId: note._id, userId: req.user._id })
    .sort({ chunkIndex: 1 })
    .lean();

  if (!chunks.length) throw new ApiError(422, "Note has no indexable content");

  const context = chunks.map(c => c.text).join("\n\n");
  const concepts = await extractKeyConcepts(context);

  res.json(new ApiResponse(200, { concepts }, `Extracted ${concepts.length} key concepts`));
});

// ─── Delete Index ─────────────────────────────────────────────────────────────

/**
 * DELETE /rag/index/:noteId
 * Removes embeddings for a note (call from note delete handler too).
 */
export const deleteNoteIndexHandler = asyncHandler(async (req, res) => {
  const note = await getNoteOrThrow(req.params.noteId, req.user._id);
  await deleteNoteIndex(note._id, req.user._id);
  res.json(new ApiResponse(200, {}, "Note index removed"));
});