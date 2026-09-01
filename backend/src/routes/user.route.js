import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  me,
} from "../controllers/auth.controller.js";
import {
  getNote,
  updateNote,
  createNote,
  deleteNotes,
  recentNotes,
} from "../controllers/note.controller.js";
import {
  createFolder,
  deleteFolders,
  getFolderStructure,
  updateFolder,
} from "../controllers/folder.controller.js";
import {
  createFlashcard,
  deleteFlashcards,
  updateFlashcard,
  getFlashcards,
  getFlashcardsByNote,
  reviewUpdate,
  getDeckStats,
  getFlashcardsActivity,
  recentFlashcards,
} from "../controllers/flashcard.controller.js";
import {
  checkUserExists,
  validateCredentials,
  validate,
  verifyJwt,
  checkExists,
} from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import {
  updateNoteSchema,
  createNoteSchema,
  deleteNotesSchema,
} from "../schemas/noteSchema.js";
import { Folder } from "../models/folder.model.js";
import {
  updateFolderSchema,
  createFolderSchema,
  deleteFoldersSchema,
} from "../schemas/folderSchema.js";
import {
  updateFlashcardSchema,
  createFlashcardSchema,
  deleteFlashcardsSchema,
} from "../schemas/flashcardSchema.js";
import { Note } from "../models/note.model.js";

const router = Router();

// Auth Routes
router.post("/signup", validate(registerSchema), checkUserExists, registerUser);
router.post("/login", validate(loginSchema), validateCredentials, loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh", refreshToken);
router.post("/me", me);

// Notes Routes
router.get("/notes/:id", verifyJwt, getNote);
router.patch(
  "/notes/:id",
  verifyJwt,
  validate(updateNoteSchema),
  checkExists(Folder, "body", "folderId"),
  updateNote,
);
router.post(
  "/notes",
  verifyJwt,
  validate(createNoteSchema),
  checkExists(Folder, "body", "folderId"),
  createNote,
);
router.delete("/notes", verifyJwt, validate(deleteNotesSchema), deleteNotes);

// Folder Routes
router.post("/workspace", verifyJwt, getFolderStructure, recentNotes, recentFlashcards);
router.patch(
  "/folders/:id",
  verifyJwt,
  validate(updateFolderSchema),
  checkExists(Folder, "body", "folderId"),
  updateFolder,
);
router.post(
  "/folders",
  verifyJwt,
  validate(createFolderSchema),
  checkExists(Folder, "body", "folderId"),
  createFolder,
);
router.delete(
  "/folders",
  verifyJwt,
  validate(deleteFoldersSchema),
  deleteFolders,
);

// Flashcard Routes
router.patch(
  "/flashcards/:id",
  verifyJwt,
  validate(updateFlashcardSchema),
  checkExists(Note, "body", "noteId"),
  updateFlashcard,
);
router.post(
  "/flashcards",
  verifyJwt,
  validate(createFlashcardSchema),
  checkExists(Note, "body", "noteId"),
  createFlashcard,
);
router.delete(
  "/flashcards",
  verifyJwt,
  validate(deleteFlashcardsSchema),
  deleteFlashcards,
);
router.get("/flashcards/stats", verifyJwt, getFlashcardsActivity);
router.get("/flashcards/decks", verifyJwt, getDeckStats);
router.get("/flashcards/all/:id", verifyJwt, getFlashcardsByNote);
router.patch("/flashcards/review/:id", verifyJwt, reviewUpdate);
router.get("/flashcards/:id", verifyJwt, getFlashcards);
export default router;
