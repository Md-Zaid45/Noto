import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { folders } from "../../store/data";
const API_URL = import.meta.env.VITE_API_URL

const foldersSlice = createSlice({
  name: "folders",
  initialState: [],
  reducers: {
    renameFolder: (state, action) => {
      const { id, name } = action.payload;
      console.log("folderslice", name);
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
      console.log(newFolder);
      state.push(newFolder);
    },
    deleteFolder: (state, action) => {
      console.log(action.payload);
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
      console.log("CASE CALLED, payload is:", action.payload);
      console.log("folders:", action.payload?.folders);
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
    builder.addCase(createFolderAsync.fulfilled, (state, action) => {
      console.log("asyncthunk", action.payload);
      const newFolder = {
        id: action.payload._id,
        name: action.payload.name,
        parentFolderId: action.payload.folderId || "r",
        revisionMark: action.payload.revisionMarks || false,
        type: "folder",
      };
      const id = action.meta.arg.tempId;
      const index = state.findIndex((folder) => folder?.tempId === id);
      console.log("index of folder", index);

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

export const createFolderAsync = createAsyncThunk(
  "folders/createFolder",
  async ({ name, parentFolderId = null, revisionMark = false }) => {
    const newFolder = { name, revisionMark, folderId: parentFolderId };
    const data = await fetch(`${API_URL}/api/v1/users/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newFolder),
    });
    const res = await data.json();
    console.log("res of createfolder", res);
    return res.payload.folder;
  },
);

export const deleteFoldersAsync = createAsyncThunk(
  "folders/deleteFolders",
  async (ids) => {
    console.log("deletefolderasync ids", ids);
    const res = await fetch(`${API_URL}/api/v1/users/folders`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error("res error at deleteFolderAsync");
    const data = await res.json();
    console.log("res in deleteFolderAsync", data, ids);
    return data;
  },
);

export const updateFolderAsync = createAsyncThunk(
  "folders/updateFolder",
  async (obj) => {
    const { id, ...updateField } = obj;
    console.log("updateFolderAsync ", obj, updateField);
    const res = await fetch(
      `${API_URL}/api/v1/users/folders/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateField),
      },
    );
    if (!res.ok) throw new Error("res error at updateFolderAsync");
    const data = await res.json();
    console.log("res at updateFolderAsync", data);
    return data?.payload?.folder;
  },
);
