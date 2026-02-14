import { EditorContent } from "@tiptap/react";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "./tabs";
import { useEditor, useNote, useTabs } from "./hooks";
import { useCallback, useEffect, useRef } from "react";

export default function Editr() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = useNote(id);
  const [tabs, deleteTab] = useTabs(note, id);
  const editors = useRef(new Map());

  const editor = useEditor(editors, tabs, note);

  const deleteHandler = useCallback((tab) => {
    const nextTabs = tabs.filter((t) => t.id !== tab.id);
    deleteTab(tab.id);

    if (tab.id === id) {
      setTimeout(() => {
        if (nextTabs.length > 0) {
          navigate(`../note/${nextTabs.at(-1).id}`);
        } else {
          navigate("../");
        }
      }, 0);
    }
  },[tabs,deleteTab,id])

  useEffect(() => {
    return () => {
      for (const [editorId, edt] of [...editors.current]) {
        edt.destroy();
        editors.current.delete(editorId);
      }
    };
  }, []);

  console.log("editor comp ", id, tabs, editor);
  return (
    <>
      <Tabs OpenTabs={tabs} deleteHandler={deleteHandler} />
      {editor ? (
        <div className="">
          <MenuBar editor={editor} />
          <EditorBubbleMenu editor={editor} />
          <EditorContent editor={editor} />
        </div>
      ) : (
        <center className="mt-35 text-emerald-500 text-3xl">
          No Note Found!
        </center>
      )}
    </>
  );
}
