import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { sidebarContext } from "../../../home";
import { useDispatch, useSelector } from "react-redux";
import { treeContext } from "./store";
import { fileTree } from "./utils";
import { UiController } from "../../../store/uiController";
import SiderbarHeader from "./sidebarHeader";
import Tree from "./treeRenderer";
import { useLocation, useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { setManageSelectedId } from "../../flashcards/flashcardSlice";

function FlashcardList() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const flashcards = useSelector((state) => state.Flashcards.cards);
  const activeId = useSelector((state) => state.Flashcards.manageSelectedId);

  const filtered = useMemo(
    () => flashcards.filter((c) => c.noteId === id),
    [flashcards, id],
  );

  return (
    <div className="w-[210px] h-full overflow-y-auto">
      <div className="px-3 py-2 text-[12.5px] font-medium text-[#4A4947] dark:text-stone-300 border-b border-[#E8E6E1] dark:border-stone-800">
        Flashcards ({filtered.length})
      </div>
      <div className="text-[12.5px]">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`
              flex items-center gap-1.5 pr-2 cursor-pointer
              transition-all duration-150 text-[#6B6A65] dark:text-stone-400
              ${
                activeId === c.id
                  ? "bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#047857] dark:text-emerald-300 font-medium"
                  : "hover:bg-[#d1fae5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400"
              }
            `}
            style={{
              padding: "5px 8px 5px 22px",
              borderLeft:
                activeId === c.id
                  ? "2px solid #34d399"
                  : "2px solid transparent",
            }}
            onClick={() => dispatch(setManageSelectedId(c.id))}
          >
            <FileText
              className={`shrink-0 text-[13px] ${
                activeId === c.id
                  ? "text-[#059669] dark:text-emerald-400"
                  : "text-[#A8A7A2] dark:text-stone-500"
              }`}
              size={13}
            />
            <span className="truncate text-[12.5px]">{c.question}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-2 text-[12.5px] text-[#A8A7A2] dark:text-stone-500">
            No flashcards
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeftSidebar({ view, setView, treeOpen }) {
  const { pathname } = useLocation();
  const activeView = pathname.split("/")[2] || "";
  const { Active, setActive, Rename, setRename } = useContext(sidebarContext);
  const { id } = useParams();
  const activeRef = useRef(null);
  const Notes = useSelector((state) => state.Notes);
  const NotesContent = useSelector((state) => state.NotesContent);
  const Folders = useSelector((state) => state.Folders);
  const fileButtonRef = useRef(null);
  const folderButtonRef = useRef(null);
  const inputRef = useRef(null);

  const [ShowInputFolder, setShowInputFolder] = useState(null);
  const [ShowInputNote, setShowInputNote] = useState(null);
  const renameRef = useRef(null);
  const path = pathname.split("/")[3] || "";
  const tree = useMemo(() => {
    return fileTree(Folders, Notes);
  }, [Folders, Notes]);

  useEffect(() => {
    if (id) setActive(id);
    else setActive("r");
  }, [id]);

  useEffect(() => {
    renameRef?.current?.focus();
    UiController.rename = {
      ref: renameRef,
      close: () => {
        renameRef.current = null;
        setRename(null);
      },
    };
    return () => {
      UiController.rename = null;
    };
  }, [Rename]);

  useEffect(() => {
    UiController.resetActive = { reset: () => setActive("r") };
    return () => (UiController.resetActive = null);
  }, []);

  useEffect(() => {
    const isEmpty = !tree.children?.length && !tree.notes?.length;
    if (isEmpty) setActive("r");
  }, [tree.children, tree.notes]);

  const isManage = path === "manage";

  return (
    <>
      <div
        data-left-sidebar
        className={`h-full overflow-hidden shrink-0 bg-[#f7f8f7] dark:bg-stone-950 border-r border-[#E8E6E1] dark:border-stone-800 select-none transition-all duration-200 ease-in-out ${
          treeOpen ? "w-[210px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isManage ? (
          <FlashcardList />
        ) : (
          <div className="w-[210px]">
            <treeContext.Provider
              value={{
                renameRef,
                activeRef,
                setShowInputNote,
                ShowInputNote,
                inputRef,
                ShowInputFolder,
                setShowInputFolder,
                activeView,
              }}
            >
              <div data-tree-header>
                <SiderbarHeader
                  fileButtonRef={fileButtonRef}
                  folderButtonRef={folderButtonRef}
                  setShowInputFolder={setShowInputFolder}
                  setShowInputNote={setShowInputNote}
                />

                <Tree folder={tree} />
              </div>
            </treeContext.Provider>
          </div>
        )}
      </div>
    </>
  );
}
