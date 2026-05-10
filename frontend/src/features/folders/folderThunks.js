import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";
const API_URL = import.meta.env.VITE_API_URL;

export const createFolderAsync = createAsyncThunk(
  "folders/createFolder",
  async ({ name, parentFolderId = null, revisionMark = false }) => {
    const newFolder = { name, revisionMark, folderId: parentFolderId };
    const data = await apiFetch(`${API_URL}/api/v1/users/folders`, {
      method: "POST",
      body: newFolder,
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
    const res = await apiFetch(`${API_URL}/api/v1/users/folders`, {
      method: "DELETE",
      body: { ids },
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
    const res = await apiFetch(`${API_URL}/api/v1/users/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateField),
    });
    if (!res.ok) throw new Error("res error at updateFolderAsync");
    const data = await res.json();
    console.log("res at updateFolderAsync", data);
    return data?.payload?.folder;
  },
);
