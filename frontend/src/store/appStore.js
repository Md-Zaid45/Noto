import { configureStore } from "@reduxjs/toolkit";
import notesSlice from "../features/notes/notesSlice";
import foldersSlice from "../features/folders/foldersSlice";
import notesContentSlice from "../features/notes/notesContentSlice";
import authSlice from "./authSlice";
import flashcardSlice from "../features/flashcards/flashcardSlice";

const appStore = configureStore({
  reducer: {
    Notes: notesSlice.reducer,
    Folders: foldersSlice.reducer,
    NotesContent: notesContentSlice.reducer,
    Flashcards: flashcardSlice.reducer,
    Auth: authSlice.reducer,
  },
});

export default appStore;
