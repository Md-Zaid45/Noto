import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const createFlashcardAsync = createAsyncThunk(
  "flashcard/addFlashcard",
  async ({ question, noteId, revisionMark = true, answer }) => {
    const newCard = { question, noteId, revisionMark, answer };

    const res = await apiFetch(`/flashcards`, {
      method: "POST",
      body: newCard,
    });
    if (!res.ok) throw new Error("response failure in createFlashcardAsync");

    const data = await res.json();
    return data.payload.flashcard;
  },
);

export const updateFlashcardAsync = createAsyncThunk(
  "flashcard/updateFlashcard",
  async (obj) => {
    const { id, ...updateField } = obj;

    const res = await apiFetch(`/flashcards/${id}`, {
      method: "PATCH",
      body: updateField,
    });
    if (!res.ok) throw new Error("res error at updateFlashcardsAsync");
    const data = await res.json();
    return data.payload.flashcard;
  },
);

export const deleteFlashcardsAsync = createAsyncThunk(
  "flashcard/deleteFlashcards",
  async (ids) => {
    const res = await apiFetch(`/flashcards`, {
      method: "DELETE",
      body: { ids },
    });
    if (!res.ok) throw new Error("response failure in deleteFlashcardAsync");
    const data = await res.json();
    return data.payload;
  },
);
