import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { sidebarContext } from "../../../pages/home";
import { useSelector } from "react-redux";
import { treeContext } from "./store";
import { fileTree } from "./utils";
import { UiController } from "../../../store/uiController";
import SiderbarHeader from "./sidebarHeader";
import Tree from "./treeRenderer";
import { useParams } from "react-router-dom";
export default function LeftSidebar({ ExpandLeftbar }) {
  console.log("sidebar comp rendered");

  const { Active, setActive, Rename, setRename } = useContext(sidebarContext);
  const {id}= useParams()
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
  const tree = useMemo(() => fileTree(Folders, Notes), [Folders, Notes]);
  console.log("tree", tree);

  useEffect(() => {
    if (id) setActive(id);
    else setActive("r");
  }, [id]);

  useEffect(() => {
    console.log(renameRef.current);
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
  useEffect(() => {}, []);

  useEffect(() => {
    const isEmpty = !tree.children?.length && !tree.notes?.length;

    if (isEmpty) {
      setActive("r");
    }
  }, [tree.children, tree.notes]);

  return (
    <>
      {ExpandLeftbar && (
        <div
          data-left-sidebar
          className={`
        bg-sky-950 h-screen overflow-hidden block
        transition-all duration-300 ease-out
        text-white select-none shrink-0
        ${ExpandLeftbar ? "w-60 opacity-100" : "w-0 opacity-0"}
      `}
        >
          {
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
              <div data-tree-header className=" mt-10 space-y-2 ">
                <SiderbarHeader
                  fileButtonRef={fileButtonRef}
                  folderButtonRef={folderButtonRef}
                  setShowInputFolder={setShowInputFolder}
                  setShowInputNote={setShowInputNote}
                />
                <Tree folder={tree} />
              </div>
            </treeContext.Provider>
          }
        </div>
      )}
    </>
  );
}
