import { createSlice, nanoid } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL

const notesContentSlice = createSlice({
  name: "notes-content",
  initialState: [],
  reducers: {
    updateNoteContent: (state, action) => {
      console.log("update NoteContent", action.payload);
      const note = state?.find((note) => note.noteId === action.payload.id);
      if (note) {
        note.content = action.payload.content;
      } else {
        console.log("invalid note.id for update NoteContent", action.payload);
      }
    },
    addNoteContent: (state, action) => {
      if (action.payload) {
        console.log("add NoteContent", action.payload);
        const newNote = {
          id: action.payload.noteId,
          noteId: action.payload.noteId,
          name: action.payload.name,
          content: action.payload.content || {},
        };
        state.push(newNote);
      } else {
        console.log("Empty payload for adding noteContent", action.payload);
      }
    },

    deleteNoteContent: (state, action) => {
      if (action.payload?.id) {
        state = state?.filter((note) => note.noteId != action.payload.id);
      }
    },
    deleteNotesContent: (state, action) => {
      console.log("notescontent................", state, action.payload);
      if (action.payload) {
        return state.filter((note) => !action.payload.includes(note.noteId));
      }
    },

  },
      extraReducers: (builder) => {
      builder.addCase("HYDRATE_APP", (state, action) => {
        const newState = action.payload.notesContent.map((note) => ({
          id: note._id,
          name: note.name,
          noteId: note._id,
          content: note.content,
        }));
        console.log("notescntentSlice", newState);

        return newState;
      });
    },
});

export default notesContentSlice;
export const {
  addNoteContent,
  deleteNoteContent,
  deleteNotesContent,
  updateNoteContent,
} = notesContentSlice.actions;
