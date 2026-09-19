import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { addNote } from "../features/notes/notesSlice";
import { createNoteAsync } from "../features/notes/notesThunks";
import { FileText, Plus } from "lucide-react";

export default function EmptyState() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);

  const handleNewNote = async () => {
    if (creating) return;
    setCreating(true);
    const tempId = nanoid();
    dispatch(addNote({ name: "Untitled", folderId: null, tempId }));
    try {
      const result = await dispatch(
        createNoteAsync({ name: "Untitled", folderId: null, tempId }),
      ).unwrap();
      navigate(`/home/notes/${result._id}`);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#f9fafb] dark:bg-stone-950 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#d1fae5] dark:bg-emerald-950/30 flex items-center justify-center mb-5">
        <FileText className="w-7 h-7 text-[#059669] dark:text-emerald-400" />
      </div>

      <h1 className="text-lg font-bold font-heading text-[#111827] dark:text-stone-100 mb-2">
        No note selected
      </h1>

      <p className="text-sm text-[#6b7280] dark:text-stone-400 mb-6 max-w-sm leading-relaxed">
        Select a note from the sidebar or create a new one to get started.
      </p>

      <button
        onClick={handleNewNote}
        disabled={creating}
        className="flex items-center gap-2 bg-[#059669] dark:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#047857] dark:hover:bg-emerald-700 transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        {creating ? "Creating..." : "New Note"}
      </button>
    </div>
  );
}
