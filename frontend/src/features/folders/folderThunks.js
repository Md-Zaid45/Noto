import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const createFolderAsync = createAsyncThunk(
  "folders/createFolder",
  async ({ name, parentFolderId = null, revisionMark = false }) => {
    const newFolder = { name, revisionMark, folderId: parentFolderId };
    const res = await apiFetch(`/folders`, {
      method: "POST",
      body: newFolder,
    });
    if (!res.ok) throw new Error("Failed to create folder");
    const data = await res.json();
    return data.payload?.folder;
  },
);

export const deleteFoldersAsync = createAsyncThunk(
  "folders/deleteFolders",
  async (ids) => {
    const res = await apiFetch(`/folders`, {
      method: "DELETE",
      body: { ids },
    });
    if (!res.ok) throw new Error("res error at deleteFolderAsync");
    const data = await res.json();
    return data;
  },
);

export const updateFolderAsync = createAsyncThunk(
  "folders/updateFolder",
  async (obj) => {
    const { id, ...updateField } = obj;
    const res = await apiFetch(`/folders/${id}`, {
      method: "PATCH",
      body: updateField,
    });
    if (!res.ok) throw new Error("Failed to update folder");
    const data = await res.json();
    return data?.payload?.folder;
  },
);
