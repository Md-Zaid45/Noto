import { createSlice, nanoid } from "@reduxjs/toolkit";

const notesContentSlice = createSlice({
  name: "notes-content",
  initialState: [],
  reducers: {
    updateNoteContent: (state, action) => {
      const note = state?.find((note) => note.noteId === action.payload.id);
      if (note) {
        note.content = action.payload.content;
      }
    },
    addNoteContent: (state, action) => {
      if (action.payload) {
        const newNote = {
          id: action.payload.noteId,
          noteId: action.payload.noteId,
          name: action.payload.name,
          content: action.payload.content || {},
        };
        state.push(newNote);
      }
    },

    deleteNoteContent: (state, action) => {
      if (action.payload?.id) {
        state = state?.filter((note) => note.noteId != action.payload.id);
      }
    },
    deleteNotesContent: (state, action) => {
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
