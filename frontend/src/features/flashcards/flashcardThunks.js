import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const createFlashcardAsync = createAsyncThunk(
  "flashcard/addFlashcard",
  async ({ question, noteId, revisionMark = true, answer }) => {
    const newCard = { question, noteId, revisionMark, answer };
    console.log("thunk noteslice", newCard);

    const res = await apiFetch(`${API_URL}/api/v1/users/flashcards`, {
      method: "POST",
      body: newCard,
    });
    if (!res.ok) throw new Error("response failure in createFlashcardAsync");

    const data = await res.json();
    console.log("createFlashcardAsync res ", data);
    return data.payload.flashcard;
  },
);

export const updateFlashcardAsync = createAsyncThunk(
  "flashcard/updateFlashcard",
  async (obj) => {
    const { id, ...updateField } = obj;
    console.log("updateFlashcardsAsync", id, updateField);

    const res = await apiFetch(`${API_URL}/api/v1/users/flashcards/${id}`, {
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
    console.log("ids in deleteFlashcardAsync", ids);

    const res = await apiFetch(`${API_URL}/api/v1/users/flashcards`, {
      method: "DELETE",
      body: { ids },
    });
    if (!res.ok) throw new Error("response failure in deleteFlashcardAsync");
    const data = await res.json();
    console.log("res in deleteFlashcardAsync", data, ids);
    return data.payload;
  },
);
