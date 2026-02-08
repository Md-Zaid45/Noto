import { EditorContent } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import { MenuBar } from "./MenuBar";
import { EditorBubbleMenu } from "./bubbleMenu";
import "./styles.scss";
import { editorInstance } from "./editorUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { sidebarContext } from "../../../pages/home";
import { RxCross2 } from "react-icons/rx";

function navigateHandler(OpenTabs, navigate, setActive) {
  if (OpenTabs.length > 0) {
    navigate(`../note/${OpenTabs.at(-1).id}`);
    setActive(OpenTabs.at(-1).id);
  } else {
    navigate("../home");
    setActive("r");
  }
}

function addTab(id, note, setOpenTabs) {
  setOpenTabs((prev) => {
    if (prev.find((tab) => tab.id === id)) return prev;
    let newTabs = prev;
    if (note) {
      newTabs = [...prev, { id, name: note.name }];
    }
    localStorage.setItem("tabs", JSON.stringify(newTabs));
    return newTabs;
  });
}

const deleteHandler = (tab, navigate, setActive, setOpenTabs, editors) => {
  setOpenTabs((prev) => {
    const nextTabs = prev.filter((node) => node.id !== tab.id);
    navigateHandler(nextTabs, navigate, setActive);
    localStorage.setItem("tabs", JSON.stringify(nextTabs));
    return nextTabs;
  });
  editors.current.delete(tab.id);
};

const clickHandler = (tab, navigate, setActive) => {
  navigate(`../note/${tab.id}`);
  setActive(tab.id);
};

export default function Editr() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editors = useRef(new Map());
  const dispatch = useDispatch();
  const { Active, setActive, deletionIds } = useContext(sidebarContext);
  const [OpenTabs, setOpenTabs] = useState(
    JSON.parse(localStorage.getItem("tabs")),
  );
  const NotesContent = useSelector((state) => state.NotesContent);
  const Notes = useSelector((state) => state.Notes);
  const Note = Notes.find((note) => note.id === id);
  const note = NotesContent.find((note) => note.noteId === id);
  let editor = null;
  if (Note) {
    editor = editorInstance(editors, id, note, dispatch);
  }
  console.log("editor comp ", id, OpenTabs, editor);

  if (!editor) navigateHandler(OpenTabs, navigate, setActive);

  useEffect(() => {
    addTab(id, Note, setOpenTabs);

    if (deletionIds.current != []) {
      setOpenTabs((prev) => {
        let newTabs = prev.filter((tab) => {
          if (deletionIds.current.includes(tab.id)) {
            editors.current.delete(tab.id);
            return false;
          } else return true;
        });
        localStorage.setItem("tabs", JSON.stringify(newTabs));
        return newTabs;
      });
    }
  }, [id, Notes, deletionIds.current]);
  console.log("editor comp ", id, OpenTabs);
  return (
    <>
      <div className="mt-10 flex bg-gray-200 py-0.5">
        {OpenTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${tab.id === id ? "bg-gray-300" : ""} px-1 text-sm outline-1 flex items-center gap-2 py-0.5 cursor-pointer `}
          >
            <div
              className="mb-1"
              onClick={() => clickHandler(tab, navigate, setActive)}
            >
              {tab.name}
            </div>
            <RxCross2
              className="text-md"
              onClick={() =>
                deleteHandler(tab, navigate, setActive, setOpenTabs, editors)
              }
            />
          </div>
        ))}
      </div>
      <div className="">
        <MenuBar editor={editor} />
        <EditorBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
