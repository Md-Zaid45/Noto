import { createSlice, nanoid } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;

const flashcardSlice = createSlice({
  name: "flashcards",
  initialState: [],
  reducers: {
    addFlashcard: (state, action) => {
      console.log("addFlashcard in slice", action.payload);
      const id = nanoid(5);
      const newCard = {
        id,
        tempId: id,
        question: action.payload.question,
        answer: action.payload.answer,
        noteId: action.payload.noteId,
        type: "flashcard",
      };
      state.push(newCard);
    },
    deleteFlashcards: (state, action) => {
      const deletionIds = action.payload;
      console.log(deletionIds, "flashcardSlice");
      if (deletionIds)
        return state.filter((node) => !deletionIds.includes(node.id));
    },
    addRevisionMarkFlashcard: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const flashcard = state.find((node) => node.id === id);
          if (flashcard) flashcard.revisionMark = true;
        });
      }
    },
    removeRevisionMarkFlashcard: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const flashcard = state.find((node) => node.id === id);
          if (flashcard) flashcard.revisionMark = false;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("HYDRATE_APP", (state, action) => {
      console.log("CASE CALLED, payload is:", action.payload);
      const newState = action.payload?.flashcards.map((flashcard) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        id: flashcard._id,
        noteId: flashcard.noteId,
        revisionMark: flashcard.revisionMark || false,
        type: "flashcard",
      }));
      return newState;
    });

    builder.addCase("flashcard/addFlashcard/fulfilled", (state, action) => {
      console.log("builder note add from backend");
      const newFolder = {
        question: action.payload.question,
        answer: action.payload.answer,
        id: action.payload._id,
        folderId: action.payload.noteId,
        revisionMark: action.payload.revisionMark || false,
        type: "flashcard",
      };
      const id = action.meta.arg.tempId;
      const index = state.findIndex((note) => note?.tempId === id);
      if (index !== -1) state[index] = newFolder;
      else state.push(newFolder);
      console.log("builder note add from backend", newFolder);
    });
  },
});

export const {
  addFlashcard,
  deleteFlashcards,
  addRevisionMarkFlashcard,
  removeRevisionMarkFlashcard,
} = flashcardSlice.actions;

export default flashcardSlice;

