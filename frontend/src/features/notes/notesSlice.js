import { createSlice } from "@reduxjs/toolkit";
import { notes } from "../../store/data";

const notesSlice = createSlice({
  name: "notes",
  initialState: notes,
  reducers: {
    renameNote: (state, action) => {
      const { id, name } = action.payload;
       console.log("noteslice",action.payload)
       
        const note = state.find((node) => node.id == id);
        note.name = name;
      
    },
    addNote: (state, action) => {
      const {  name, folderId } = action.payload;
      console.log("noteslice",action.payload)
      const newNote= {
        id: `n-${state.length + 1}`,
    userId: 1,
    folderId,
    name,
    content: "",
    revisionMark: false,
    type: "file",}
      if ((action.payload)) state.push(newNote);
    },
    deleteNote: (state, action) => {
      const  id  = action.payload;
       console.log(id,"noteslice")
      if (id) return state.filter((node) => node.id != id);
    },
    deleteChildrenNotes: (state, action) => {
      const  deletionIds  = action.payload;
      console.log(deletionIds,"noteslice")
      if (deletionIds)
        return state.filter((node) => !deletionIds.includes(node.id));
    },
    addRevisionMarkNote: (state, action) => {
      const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const note = state.find((node) => node.id === id);
          if(note)note.revisionMark = true;
        });
      }
    },
    removeRevisionMarkNote: (state, action) => {
     const { ids } = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const note = state.find((node) => node.id === id);
          if(note)note.revisionMark = false;
        });
      }
    },
  },
});
export const {renameNote,addNote,deleteNote,deleteChildrenNotes,addRevisionMarkNote,removeRevisionMarkNote}= notesSlice.actions
export default notesSlice;
