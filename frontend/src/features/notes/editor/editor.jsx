import { EditorContent } from "@tiptap/react";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "./tabs";
import { useEditor, useNote, useTabs } from "./hooks";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { HiOutlineCheckBadge } from "react-icons/hi2";

export default function Editr() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const note = useNote(id, setIsLoading);
  const [tabs, deleteTab] = useTabs(note, id);
  const editors = useRef(new Map());

  const [editor, isSaved] = useEditor(editors, tabs, note);

  const deleteHandler = useCallback(
    (tab) => {
      const nextTabs = tabs.filter((t) => t.id !== tab.id);
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

  useEffect(() => {
    return () => {
      for (const [editorId, edt] of [...editors.current]) {
        edt.destroy();
        editors.current.delete(editorId);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col h-full bg-zinc-200">
        <Tabs OpenTabs={tabs} deleteHandler={deleteHandler} />

        {editor ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Saved indicator */}
            {isSaved === id && (
              <div className="fixed top-20 right-8 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200 animate-fade-in">
                <HiOutlineCheckBadge className="text-emerald-500 text-sm" />
                <span>Saved</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <div className="h-full bg-zinc-50/80 px-3 py-2">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 rounded flex items-center justify-center z-10">
                    <LoadingLoader size="lg" color="blue" />
                  </div>
                )}
                <MenuBar editor={editor} />
                <div className="mt-2">
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
          <div className="flex-1 flex flex-col items-center justify-center bg-transparent">
            <div className="w-24 h-24 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
              <span className="text-4xl">🔍</span>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black bg-gradient-to-br from-emerald-400 to-emerald-700 bg-clip-text text-transparent">
                No Note found
              </h1>
              <div className="h-1 w-12 bg-emerald-500/30 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
