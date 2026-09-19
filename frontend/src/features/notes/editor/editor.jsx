import { EditorContent } from "@tiptap/react";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "./tabs";
import { useEditor, useNote, useTabs } from "./hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { FileText } from "lucide-react";
import LoadingLoader from "../../../commons/loader";
import { useDispatch } from "react-redux";
import { renameNote } from "../notesSlice";
import { updateNoteAsync } from "../notesThunks";
import { updateNoteName } from "../notesContentSlice";

export default function Editr() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const note = useNote(id, setIsLoading);
  const [tabs, deleteTab] = useTabs(note, id);
  const editors = useRef(new Map());

  const [editor, isSaved] = useEditor(editors, tabs, note);
  const [title, setTitle] = useState(note?.name);
  
  useEffect(() => {
    if (note?.name) {
      setTitle(note.name);
    }
  }, [note?.name]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (!note?.noteId) return;
    const finalTitle = title.trim() || "Untitled";
    setTitle(finalTitle);
    dispatch(updateNoteName({ id: note.noteId, name: finalTitle }));
    dispatch(renameNote({ id: note.noteId, name: finalTitle }));
    dispatch(updateNoteAsync({ id: note.noteId, name: finalTitle }));
  };

  const deleteHandler = useCallback(
    (tab) => {
      const nextTabs = (tabs || []).filter((t) => t.id !== tab.id);
      deleteTab(tab.id);

      if (tab.id === id) {
        setTimeout(() => {
          if (nextTabs.length > 0) {
            navigate(`../notes/${nextTabs.at(-1).id}`);
          } else {
            navigate("../");
          }
        }, 0);
      }
    },
    [tabs, deleteTab, id],
  );

  // useEffect(() => {
  //   return () => {
  //     for (const [editorId, edt] of [...editors.current]) {
  //       edt.destroy();
  //       editors.current.delete(editorId);
  //     }
  //   };
  // }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900">
      <Tabs OpenTabs={tabs} deleteHandler={deleteHandler} />
      {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center z-10">
                  <LoadingLoader size="lg" color="blue" />
                </div>
              )}
      {!isLoading && editor ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {isSaved === id && (
            <div className="fixed top-20 right-8 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-950/30 animate-fade-in">
              <HiOutlineCheckBadge className="text-emerald-500 dark:text-emerald-400 text-sm" />
              <span>Saved</span>
            </div>
          )}

          <MenuBar editor={editor} />
          <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
            <div className="h-full bg-white dark:bg-stone-900">
              
              <div className="pt-9 px-12" style={{ maxWidth: "700px" }}>
                <style>{`.note-title::-webkit-scrollbar { display: none; }`}</style>
                <textarea
                  className="note-title w-full text-2xl font-[500] font-heading bg-transparent border-none outline-none resize-none overflow-hidden mb-4 placeholder-stone-400 dark:placeholder-stone-500 font-heading"
                  style={{ color: "var(--editor-text)", resize: "none", overflow: "hidden", scrollbarWidth: "none" }}
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  placeholder="Untitled"
                  rows={1}
                />
                <EditorBubbleMenu editor={editor} />
                <EditorContent
                  editor={editor}
                  className="tiptap focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f9fafb] dark:bg-stone-950">
          <div className="w-16 h-16 rounded-2xl bg-[#d1fae5] dark:bg-emerald-950/30 flex items-center justify-center mb-5">
            <FileText className="w-7 h-7 text-[#059669] dark:text-emerald-400" />
          </div>
          <h1 className="text-lg font-bold font-heading text-[#111827] dark:text-stone-100 mb-2">
            No note found
          </h1>
          <p className="text-sm text-[#6b7280] dark:text-stone-400 max-w-sm">
            Select a note from the sidebar to start editing.
          </p>
        </div>
      )}
    </div>
  );
}