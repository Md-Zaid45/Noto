import { createSlice, nanoid } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

const foldersSlice = createSlice({
  name: "folders",
  initialState: [],
  reducers: {
    renameFolder: (state, action) => {
      const { id, name } = action.payload;
      const folder = state.find((node) => node.id === id);
      if (folder) folder.name = name;
    },
    addFolder: (state, action) => {
      const { name, parentFolderId = null, tempId } = action.payload;
      let newFolder = {
        name,
        id: tempId,
        parentFolderId: parentFolderId,
        revisionMark: false,
        type: "folder",
        tempId: tempId,
      };
      state.push(newFolder);
    },
    deleteFolder: (state, action) => {
      const deletionIds = action.payload;
      if (deletionIds) {
        return state.filter((node) => !deletionIds.includes(node.id));
      }
    },
    addRevisionMarkFolder: (state, action) => {
      const ids = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const folder = state.find((node) => node.id === id);
          if (folder) folder.revisionMark = true;
        });
      }
    },
    removeRevisionMarkFolder: (state, action) => {
      const ids = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const folder = state.find((node) => node.id === id);
          if (folder) {
            folder.revisionMark = false;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("HYDRATE_APP", (state, action) => {
      const newState = action.payload?.folders.map((folder) => {
        return {
          id: folder._id,
          name: folder.name,
          parentFolderId: folder.folderId || "r",
          revisionMark: folder.revisionMarks || false,
          type: "folder",
        };
      });
      return newState || [];
    });
    builder.addCase("folders/createFolder/fulfilled", (state, action) => {
      const newFolder = {
        id: action.payload._id,
        name: action.payload.name,
        parentFolderId: action.payload.folderId || "r",
        revisionMark: action.payload.revisionMarks || false,
        type: "folder",
      };
      const id = action.meta.arg.tempId;
      const index = state.findIndex((folder) => folder?.tempId === id);

      if (index !== -1) state[index] = newFolder;
      else state.push(newFolder);
    });
  },
});
export const {
  renameFolder,
  addFolder,
  deleteFolder,
  addRevisionMarkFolder,
  removeRevisionMarkFolder,
} = foldersSlice.actions;
export default foldersSlice;

