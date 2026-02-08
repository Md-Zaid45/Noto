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
         console.log("this is content in slice", action.payload.content, state,state.length+1);
 
          const newNote = {
            id: `td-${nanoid(4)}`,
            noteId: action.payload.noteId,
            userId: 1,
            folderId: "f-2",
            name: "new",
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
        state = state?.filter((note) => note.noteId != action.payload.id);
      }
    },
    deleteNotesContent:(state,action)=>{
     console.log("notescontent................",state,action.payload)
      if(action.payload){
        return state.filter(note=> !action.payload.includes(note.noteId))
      }
    }
  },
});

export default notesContentSlice;
export const { addNoteContent, deleteNoteContent,deleteNotesContent } = notesContentSlice.actions;
