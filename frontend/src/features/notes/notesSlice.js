import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { notes } from "../../store/data";

const notesSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    renameNote: (state, action) => {
      const { id, name } = action.payload;
      console.log("noteslice", action.payload);

      const note = state.find((node) => node.id == id);
      note.name = name;
    },
    addNote: (state, action) => {
      const { name, folderId, tempId } = action.payload;
      console.log("noteslice temp addnote", action.payload);
      const newNote = {
        id: tempId,
        folderId,
        name,
        revisionMark: false,
        tempId,
        type: "file",
      };
      if (action.payload) state.push(newNote);
    },
    deleteNote: (state, action) => {
      const id = action.payload;
      console.log(id, "noteslice");
      if (id) return state.filter((node) => node.id != id);
    },
    deleteChildrenNotes: (state, action) => {
      const deletionIds = action.payload;
      console.log(deletionIds, "noteslice");
      if (deletionIds)
        return state.filter((node) => !deletionIds.includes(node.id));
    },
    addRevisionMarkNote: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const note = state.find((node) => node.id === id);
          if (note) note.revisionMark = true;
        });
      }
    },
    removeRevisionMarkNote: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const note = state.find((node) => node.id === id);
          if (note) note.revisionMark = false;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("HYDRATE_APP", (state, action) => {
      console.log("CASE CALLED, payload is:", action.payload);

      const newState = action.payload?.notes.map((note) => ({
        name: note.name,
        id: note._id,
        folderId: note.folderId || "r",
        revisionMark: note.revisionMark || false,
        type: "file",
      }));
      return newState;
    });

    builder.addCase(createNoteAsync.fulfilled, (state, action) => {
      console.log("builder note add from backend");
      const newFolder = {
        name: action.payload.name,
        id: action.payload._id,
        folderId: action.payload.folderId || "r",
        revisionMark: action.payload.revisionMark || false,
        type: "file",
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
  renameNote,
  addNote,
  deleteNote,
  deleteChildrenNotes,
  addRevisionMarkNote,
  removeRevisionMarkNote,
} = notesSlice.actions;
export default notesSlice;

export const createNoteAsync = createAsyncThunk(
  "notes/addNote",
  async ({ name, folderId = null, revisionMark = false, content = "" }) => {
    const newNote = { name, folderId, revisionMark, content };
    console.log("thunk noteslice", newNote);

    const res = await fetch("http://localhost:8000/api/v1/users/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newNote),
    });
    if (!res.ok) throw new Error("response failure in thunk");

    const data = await res.json();
    console.log("note thunk ", data);
    return data.payload.note;
  },
);

export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async (field) => {
    const {id, ...updateField} = field
        console.log('update noteasync', id, updateField);

    const res = await fetch(`http://localhost:8000/api/v1/users/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateField),
    });
    if(!res.ok) throw new Error("res error at update ntoe aync")
    const data = await res.json()
    return data.payload.note
  },
);