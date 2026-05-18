import { createSlice, nanoid } from "@reduxjs/toolkit";

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

    builder.addCase("notes/addNote/fulfilled", (state, action) => {
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

