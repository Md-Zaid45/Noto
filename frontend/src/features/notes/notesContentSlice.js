import { createSlice, nanoid } from "@reduxjs/toolkit";
import { NotesContent } from "../../store/data";

const notesContentSlice = createSlice({
  name: "notes-content",
  initialState: NotesContent,
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
      if (action.payload ) {
        console.log("add NoteContent", action.payload);
        const newNote = {
          id: `td-${nanoid(4)}`,
          noteId: action.payload.noteId,
          userId: 1,
          folderId: action.payload.folderId,
          name: action.payload.name,
          revisionMark: false,
          type: "file",
          content: "",
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
});

export default notesContentSlice;
export const {
  addNoteContent,
  deleteNoteContent,
  deleteNotesContent,
  updateNoteContent,
} = notesContentSlice.actions;
