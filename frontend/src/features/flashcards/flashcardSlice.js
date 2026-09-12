import { createSlice, nanoid } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;

const flashcardSlice = createSlice({
  name: "flashcards",
  initialState: { cards: [], manageSelectedId: null },
  reducers: {
    addFlashcard: (state, action) => {
      const id = nanoid(5);
      const newCard = {
        id,
        tempId: id,
        question: action.payload.question,
        answer: action.payload.answer,
        noteId: action.payload.noteId,
        nextReview: action.payload.nextReview || null,
        type: "flashcard",
      };
      state.cards.push(newCard);
    },
    addFlashcards: (state, action) => {
      action.payload.flashcards.forEach((flashcard) => {
        if (!state.cards.some((card) => card.id === flashcard._id))
          state.cards.push({
            question: flashcard.question,
            answer: flashcard.answer,
            id: flashcard._id,
            noteId: flashcard.noteId,
            revisionMark: flashcard.revisionMark || false,
            nextReview: flashcard.nextReview || null,
            type: "flashcard",
          });
      });
    },

    deleteFlashcards: (state, action) => {
      const deletionIds = action.payload;
      if (deletionIds)
        state.cards = state.cards.filter(
          (node) => !deletionIds.includes(node.id),
        );
    },
    addRevisionMarkFlashcard: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const flashcard = state.cards.find((node) => node.id === id);
          if (flashcard) flashcard.revisionMark = true;
        });
      }
    },
    removeRevisionMarkFlashcard: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const flashcard = state.cards.find((node) => node.id === id);
          if (flashcard) flashcard.revisionMark = false;
        });
      }
    },
    setManageSelectedId: (state, action) => {
      state.manageSelectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("HYDRATE_APP", (state, action) => {
      state.cards = action.payload?.flashcards.map((flashcard) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        id: flashcard._id,
        noteId: flashcard.noteId,
        revisionMark: flashcard.revisionMark || false,
        nextReview: flashcard.nextReview || null,
        type: "flashcard",
      }));
    });

    builder.addCase("flashcard/addFlashcard/fulfilled", (state, action) => {
      const newFolder = {
        question: action.payload.question,
        answer: action.payload.answer,
        id: action.payload._id,
        folderId: action.payload.noteId,
        revisionMark: action.payload.revisionMark || false,
        nextReview: action.payload.nextReview || null,
        type: "flashcard",
      };
      const id = action.meta.arg.tempId;
      const index = state.cards.findIndex((note) => note?.tempId === id);
      if (index !== -1) state.cards[index] = newFolder;
      else state.cards.push(newFolder);
    });

    builder.addCase("flashcard/updateFlashcard/fulfilled", (state, action) => {
      const updated = action.payload;
      const index = state.cards.findIndex((card) => card.id === updated._id);
      if (index !== -1) {
        state.cards[index] = {
          ...state.cards[index],
          question: updated.question,
          answer: updated.answer,
          revisionMark:
            updated.revisionMark ?? state.cards[index].revisionMark,
          nextReview: updated.nextReview ?? state.cards[index].nextReview,
        };
      }
    });

    builder.addCase("flashcard/deleteFlashcards/fulfilled", (state, action) => {
      const deletedIds = action.meta.arg;
      if (deletedIds) {
        state.cards = state.cards.filter(
          (card) => !deletedIds.includes(card.id),
        );
        if (deletedIds.includes(state.manageSelectedId)) {
          state.manageSelectedId = null;
        }
      }
    });
  },
});

export const {
  addFlashcard,
  deleteFlashcards,
  addFlashcards,
  addRevisionMarkFlashcard,
  removeRevisionMarkFlashcard,
  setManageSelectedId,
} = flashcardSlice.actions;

export default flashcardSlice;
