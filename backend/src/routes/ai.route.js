import { Router } from "express";
import { verifyJwt } from "../middlewares/validation.middleware.js";

import { chatResponse, getAiFlashcards, getAiQuiz, getNoteSummary } from "../controllers/chat.controller.js";

const aiRouter = Router();

// All RAG routes require authentication
//aiRouter.use(verifyJwt);

// ── Indexing ────────────────────────────────────────────────
// POST   /rag/index/:noteId     — (Re)index a note
// DELETE /rag/index/:noteId     — Remove a note's embeddings
// aiRouter.post("/index/:noteId", indexNoteHandler);
// aiRouter.delete("/index/:noteId", deleteNoteIndexHandler);

// ── Flashcard Generation ────────────────────────────────────
// POST /rag/flashcards/:noteId  — body: { count?, save? }
aiRouter.post("/flashcards/:id",verifyJwt, getAiFlashcards);

// ── Quiz Generation ─────────────────────────────────────────
// POST /rag/quiz/:noteId        — body: { count? }
aiRouter.post("/quiz/:id",verifyJwt, getAiQuiz);

// ── Summarisation ───────────────────────────────────────────
// POST /rag/summary/:noteId     — body: { style? }
aiRouter.post("/summary/:id",verifyJwt, getNoteSummary);

// ── QnA ─────────────────────────────────────────────────────
// POST /rag/ask/:noteId         — single-note chat
// POST /rag/ask                 — cross-note workspace chat
// aiRouter.post("/ask/:noteId", askNoteHandler);
 aiRouter.post("/ask/:id",verifyJwt, chatResponse);

// ── Key Concepts ─────────────────────────────────────────────
// GET  /rag/concepts/:noteId
//aiRouter.get("/concepts/:noteId", extractConceptsHandler);

export default aiRouter;