import { useContext, useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { LuFilePen, LuFolderClosed, LuFolderOpen } from "react-icons/lu";
import { treeContext } from "./store";
import { sidebarContext } from "../../../pages/home";
import Input from "./inputFileTab";
import { useDispatch } from "react-redux";
import { renameNote } from "../../notes/notesSlice";
import { renameFolder } from "../../folders/foldersSlice";
import { keydownHandler, onContextHandler } from "./handlers";
import { useNavigate } from "react-router-dom";
import { HiFolder, HiFolderOpen, HiDocumentText } from "react-icons/hi2";
import { HiChevronDown, HiChevronRight } from "react-icons/hi2";

export default function Tree({ folder, level = -1 }) {
  const navigate = useNavigate();
  level += 1;
  const {
    Active,
    setActive,
    setContextMenuPos,
    Rename,
    setRename,
    ShowContextMenu,
    setShowContextMenu,
  } = useContext(sidebarContext);
  const dispatch = useDispatch();
  const [ExpandFolder, setExpandFolder] = useState(
    folder.id === "r" ? true : false,
  );
  const {
    activeRef,
    renameRef,
    ShowInputFolder,
    ShowInputNote,
    setShowInputNote,
    setShowInputFolder,
    inputRef,
  } = useContext(treeContext);

  function toggleExpand(id) {
    id && setExpandFolder((prev) => !prev);
  }

  return (
    <div>
      <div className={folder.parentFolderId ? "w-2" : ""}></div>
      <div className="text-[14px]">
        {folder.id && folder.id !== "r" && (
          <div
            draggable
            ref={Rename === folder.id ? renameRef : null}
            contentEditable={Rename === folder.id}
            className={`
              group flex items-center gap-1.5 py-1.5 pr-2 rounded-md cursor-pointer
              transition-[background-color,color] duration-150
              text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-300
              ${Active && Active === folder.id ? "bg-indigo-50 text-indigo-700 font-medium" : ""}
            `}
            style={{ paddingLeft: `${level * 7 + 8}px` }}
            onClick={() => {
              if (Rename !== folder.id) {
                toggleExpand(folder.id);
                setActive(folder.id);
              }
            }}
            onKeyDown={(e) => {
              keydownHandler(
                e,
                Rename,
                dispatch,
                renameFolder,
                renameNote,
                setRename,
                folder,
              );
            }}
            onContextMenu={(e) =>
              onContextHandler(
                e,
                folder,
                setActive,
                setShowContextMenu,
                setContextMenuPos,
              )
            }
          >
            {ExpandFolder ? (
              <>
                <HiChevronDown
                  contentEditable={false}
                  className="text-slate-500 shrink-0 text-[15px]"
                />
                <HiFolderOpen
                  contentEditable={false}
                  className="text-indigo-500 shrink-0 text-[15px]"
                />
              </>
            ) : (
              <>
                <HiChevronRight
                  contentEditable={false}
                  className="text-slate-500 shrink-0 text-[15px]"
                />
                <HiFolder
                  contentEditable={false}
                  className="text-sky-500 shrink-0 text-[15px]"
                />
              </>
            )}
            <span className="truncate">{folder.name}</span>
          </div>
        )}

        {(ShowInputNote === folder.id || ShowInputFolder === folder.id) && (
          <Input
            inputRef={inputRef}
            setShowInputFolder={setShowInputFolder}
            ShowInputFolder={ShowInputFolder}
            ShowInputNote={ShowInputNote}
            setShowInputNote={setShowInputNote}
            folder={folder}
            level={level}
          />
        )}

        {ExpandFolder &&
          folder.children &&
          folder.children.map((node) => (
            <Tree
              key={node.id}
              folder={node}
              ShowContextMenu={ShowContextMenu}
              setShowContextMenu={setShowContextMenu}
              level={level}
            />
          ))}

        {ExpandFolder &&
          folder.notes &&
          folder.notes.map((node) => (
            <div
              draggable
              ref={Rename === node.id ? renameRef : null}
              contentEditable={Rename === node.id}
              key={node.id}
              className={`
                flex items-center gap-1.5 py-1.5 pr-2 rounded-md cursor-pointer
                transition-[background-color,color] duration-150
                text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-300
                ${Active && Active === node.id ? "bg-indigo-50 text-indigo-700 font-medium" : ""}
              `}
              style={{ paddingLeft: `${level * 7 + 21 + 8}px` }}
              onClick={() => {
                if (Rename !== node.id) {
                  setActive(node.id);
                  navigate(`notes/${node.id}`);
                }
              }}
              onContextMenu={(e) =>
                onContextHandler(
                  e,
                  node,
                  setActive,
                  setShowContextMenu,
                  setContextMenuPos,
                )
              }
              onKeyDown={(e) => {
                keydownHandler(
                  e,
                  Rename,
                  dispatch,
                  renameFolder,
                  renameNote,
                  setRename,
                  node,
                );
              }}
            >
              <HiDocumentText
                contentEditable={false}
                className="text-emerald-400 shrink-0 text-[15px]"
              />
              <span className="truncate" contentEditable={Rename === node.id}>
                {node.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
