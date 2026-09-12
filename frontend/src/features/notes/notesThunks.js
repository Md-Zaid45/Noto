import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const createNoteAsync = createAsyncThunk(
  "notes/addNote",
  async ({ name, folderId = null, revisionMark = false, content = "" }) => {
    const newNote = { name, folderId, revisionMark, content, };

    const res = await apiFetch(`/notes`, {
      method: "POST",
      body: newNote,
    });
    if (!res.ok) throw new Error("response failure in thunk");

    const data = await res.json();
    return data.payload.note;
  },
);

export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async (obj) => {
    const { id, ...updateField } = obj;

    const res = await apiFetch(`/notes/${id}`, {
      method: "PATCH",
      body: updateField,
    });
    if (!res.ok) throw new Error("res error at update ntoe aync");
    const data = await res.json();
    return data.payload.note;
  },
);

export const deleteNotesAsync = createAsyncThunk(
  "notes/deleteNotes",
  async (ids) => {
    const res = await apiFetch(`/notes`, {
      method: "DELETE",
      body: { ids },
    });
    if (!res.ok) throw new Error("response failure in deleteNoteAsync");
    const data = await res.json();
    return data.payload;
  },
);
