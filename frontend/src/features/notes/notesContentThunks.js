import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../commons/apifetch";

export const updateContentAsync = createAsyncThunk('notes-content/updateContent',async ({content,id})=>{
const res = await apiFetch(`/notes/${id}`,{
  method:"PATCH",
  body:{content}
})

if(!res.ok) throw new Error("res error at aync content update")
const data = await res.json()
return data.payload.notesContent
})
