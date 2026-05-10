import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";
const API_URL = import.meta.env.VITE_API_URL;

export const createNoteAsync = createAsyncThunk(
  "notes/addNote",
  async ({ name, folderId = null, revisionMark = false, content = "" }) => {
    const newNote = { name, folderId, revisionMark, content };
    console.log("thunk noteslice", newNote);

    const res = await apiFetch(`${API_URL}/api/v1/users/notes`, {
      method: "POST",
      body: newNote,
    });
    if (!res.ok) throw new Error("response failure in thunk");

    const data = await res.json();
    console.log("note thunk ", data);
    return data.payload.note;
  },
);

export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async (obj) => {
    const { id, ...updateField } = obj;
    console.log("update noteasync", id, updateField);

    const res = await apiFetch(`${API_URL}/api/v1/users/notes/${id}`, {
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
    console.log("ids in deletenoteasync", ids);

    const res = await apiFetch(`${API_URL}/api/v1/users/notes`, {
      method: "DELETE",
      body: { ids },
    });
    if (!res.ok) throw new Error("response failure in deleteNoteAsync");
    const data = await res.json();
    console.log("res in deleteNoteAsync", data, ids);
    return data.payload;
  },
);
