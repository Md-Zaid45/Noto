import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { sidebarContext } from "../../../pages/home";
import { useSelector } from "react-redux";
import { treeContext } from "./store";
import { fileTree } from "./utils";
import { UiController } from "../../../store/uiController";
import SiderbarHeader from "./sidebarHeader";
import Tree from "./treeRenderer";
import { useParams } from "react-router-dom";
import { BiLogoHeroku } from "react-icons/bi";

export default function LeftSidebar({ ExpandLeftbar }) {
  console.log("sidebar comp rendered");

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

  return (
    <>
      {
        <div
          data-left-sidebar
          className={`
        h-screen overflow-hidden shrink-0 mr-0.5 mt-0.5
        bg-zinc-50 border-r border-gray-200 outline-zinc-300 o outline-1
        transition-all duration-300 ease-in-out
        select-none rounded-xl
        ${ExpandLeftbar ? "w-60 opacity-100" : "w-0 opacity-0 overflow-hidden pointer-events-none"}
      `}
        >
          <div className="w-60">
            {" "}
            {/* inner fixed width so content doesn't wrap when sidebar is 0 */}
            <treeContext.Provider
              value={{
                renameRef,
                activeRef,
                setShowInputNote,
                ShowInputNote,
                inputRef,
                ShowInputFolder,
                setShowInputFolder,
              }}
            >
              <div data-tree-header className="mt-5 space-y-2 text-gray-800">
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
        </div>
      }
    </>
  );
}
