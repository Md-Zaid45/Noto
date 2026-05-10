import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";
const API_URL = import.meta.env.VITE_API_URL;

export const updateContentAsync = createAsyncThunk('notes-content/updateContent',async ({content,id})=>{
console.log("id of note for updateContent in async thunk", id,JSON.stringify({content}));
const res = await apiFetch(`${API_URL}/api/v1/users/notes/${id}`,{
  method:"PATCH",
  body:{content}
})

if(!res.ok) throw new Error("res error at aync content update")
const data = await res.json()
console.log("res from backend in updateContentAsync", data);
return data.payload.notesContent
})
