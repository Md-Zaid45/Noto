import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { editorInstance } from "./editorUtils";
import { useDispatch, useSelector } from "react-redux";
import { addNoteContent, updateNoteContent } from "../notesContentSlice";
import { updateContentAsync } from "../notesContentThunks";
import { apiFetch } from "../../../commons/apifetch";
import { createNoteAsync } from "../notesThunks";
const API_URL = import.meta.env.VITE_API_URL;

export function useStorage(key, defaultVal) {
  const [Item, setItem] = useState(() => {
    const rawVal = localStorage.getItem(key);
    return JSON.parse(rawVal || JSON.stringify(defaultVal));
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(Item));
  }, [Item, key]);
  return [Item, setItem];
}

export function useEditor(editors, OpenTabs, note) {
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(null);
  const clearTimeoutId = useRef(null);
  const editor = useMemo(() => {
    if (!note) {
      return null;
    }
    return editorInstance(editors, note);
  }, [note?.noteId, dispatch]);

  useEffect(() => {
    if (!OpenTabs.length) return;

    const openIds = new Set(OpenTabs.map((t) => t.id));
    for (const [editorId, edt] of [...editors.current]) {
      if (!openIds.has(editorId)) {
        edt.destroy();
        editors.current.delete(editorId);
      }
    }
  }, [OpenTabs]);

  useEffect(() => {
    if (isSaved === note?.noteId) {
      setTimeout(() => {
        setIsSaved(null);
      }, 1000);
    }
  }, [isSaved, note?.noteId]);

  useEffect(() => {
    if (!editor) return;

    function saveContent() {
      if (clearTimeoutId.current) clearTimeout(clearTimeoutId.current);
      clearTimeoutId.current = setTimeout(() => {
        console.log("debounce auto save...........");

        if (note)
          dispatch(
            updateNoteContent({
              id: note.noteId,
              content: editor.getJSON(),
            }),
          );
        dispatch(
          updateContentAsync({ id: note.noteId, content: editor.getJSON() }),
        );
        setIsSaved(note.noteId);
      }, 2000);
    }

    editor.on("update", saveContent);
    return () => {
      editor.off("update", saveContent);
      clearTimeout(clearTimeoutId.current);
    };
  }, [note, editor, dispatch]);

  return [editor, isSaved];
}

export function useNote(id, setIsLoading) {
  const NotesContent = useSelector((state) => state.NotesContent);
  const Notes = useSelector((state) => state.Notes);
  const dispatch = useDispatch();
  const Note = useMemo(() => Notes.find((note) => note.id === id), [Notes, id]);
  const note = useMemo(
    () => NotesContent.find((note) => note.noteId === id),
    [NotesContent, id],
  );

  useEffect(() => {
    if (Note) {
      if (!note) {
        setIsLoading(true);
        const fetchContent = async () => {
          const res = await apiFetch(`${API_URL}/api/v1/users/notes/${id}`, {
            method: "GET",
          });
          if (!res.ok) throw new Error("Unable to fetch Content");

          const { success, payload } = await res.json();
          dispatch(
            addNoteContent({
              noteId: payload.note._id || Note.id,
              name: payload.note.name || Note.name,
              content: payload.note.content || {},
            }),
          );
        };
        fetchContent();
        setIsLoading(false);
      }
    }
  }, [note?.id, Note]);

  return note;
}

export function useTabs(note, id) {
  const [Tabs, setTabs] = useStorage("tabs", []);
  const Notes = useSelector((state) => state.Notes);

  useEffect(() => {
    setTabs((prev) =>
      prev.filter((tab) => Notes.some((note) => note.id === tab.id)),
    );
  }, [Notes]);

  useEffect(() => {
    if (!note?.noteId) return;
    setTabs((prev) => {
      if (prev.find((tab) => tab.id === note.noteId)) return prev;
      const newTabs = [...prev, { id: note.noteId, name: note.name }];
      return newTabs;
    });
  }, [note?.noteId, note?.name]);

  const deleteTab = useCallback(
    (id) => {
      setTabs((prev) => {
        return prev.filter((tab) => tab.id !== id);
      });
    },
    [id],
  );

  return [Tabs, deleteTab];
}
