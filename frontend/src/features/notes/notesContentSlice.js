import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { NotesContent } from "../../store/data";

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
          content: {},
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

export const updateContentAsync = createAsyncThunk('notes-content/updateContent',async ({content,id})=>{
console.log("id of note for updateContent in async thunk", id,JSON.stringify({content}));
const res = await fetch(`http://localhost:8000/api/v1/users/notes/${id}`,{
  method:"PATCH",
  headers:{"Content-Type":"application/json"},
  credentials:'include',
  body:JSON.stringify({content})
})
if(!res.ok) throw new Error("res error at aync content update")
const data = await res.json()
console.log("res from backend in updateContentAsync", data);
return data.payload.notesContent
})

export default notesContentSlice;
export const {
  addNoteContent,
  deleteNoteContent,
  deleteNotesContent,
  updateNoteContent,
} = notesContentSlice.actions;
