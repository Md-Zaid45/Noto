import { createSlice, nanoid } from "@reduxjs/toolkit";
import { NotesContent } from "../../store/data";

const notesContentSlice = createSlice({
  name: "notes-content",
  initialState: NotesContent,
  reducers: {
    addNoteContent: (state, action) => {
        const note = state?.find((note) => note.id === action.payload.id);
        if (note) {
          note.content = action.payload.content;
        } else {
         console.log("this is content in slice", action.payload.content, state,state.lenght+1);
 
          const newNote = {
            id: `td-${nanoid(3)}`,
            noteId: action.payload.noteId,
            userId: 1,
            folderId: "f-2",
            name: "HTML Basics",
            revisionMark: false,
            type: "file",
            content: action.payload.content,
          };
          state.push(newNote);
        }
       console.log("this is content in slice", action.payload.content, state);
    },
    deleteNoteContent: (state, action) => {
      if (action.payload?.id) {
        state = state?.filter((note) => note.id != action.payload.id);
      }
    },
  },
});

export default notesContentSlice;
export const { addNoteContent, deleteNoteCOntent } = notesContentSlice.actions;
