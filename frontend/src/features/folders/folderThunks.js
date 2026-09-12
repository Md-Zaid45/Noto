import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const createFolderAsync = createAsyncThunk(
  "folders/createFolder",
  async ({ name, parentFolderId = null, revisionMark = false }) => {
    const newFolder = { name, revisionMark, folderId: parentFolderId };
    const data = await apiFetch(`/folders`, {
      method: "POST",
      body: newFolder,
    });
    const res = await data.json();
    return res.payload.folder;
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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateField),
    });
    if (!res.ok) throw new Error("res error at updateFolderAsync");
    const data = await res.json();
    return data?.payload?.folder;
  },
);
