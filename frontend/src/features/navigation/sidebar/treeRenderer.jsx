import { useContext, useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from "lucide-react";
import { treeContext } from "./store";
import { sidebarContext} from "../../../home"
import Input from "./inputFileTab";
import { useDispatch } from "react-redux";
import { renameNote } from "../../notes/notesSlice";
import { renameFolder } from "../../folders/foldersSlice";
import { keydownHandler, onContextHandler } from "./handlers";
import { useNavigate } from "react-router-dom";

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
    activeView
  } = useContext(treeContext);

  function toggleExpand(id) {
    id && setExpandFolder((prev) => !prev);
  }

  return (
    <div>
      <div className={folder.parentFolderId ? "w-2" : ""}></div>
      <div className="text-[12.5px]">
        {folder.id && folder.id !== "r" && (
          <div
            draggable
            ref={Rename === folder.id ? renameRef : null}
            contentEditable={Rename === folder.id}
            className={`
              group flex items-center gap-1.5 pr-2 cursor-pointer
              transition-all duration-150 text-[#4A4947] dark:text-stone-300
              ${Active && Active === folder.id ? "bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#047857] dark:text-emerald-300 font-medium" : "hover:bg-[#d1fae5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400"}
            ${Active === folder.id ? "dark:border-emerald-500" : ""}
            `}
            style={{ padding: "5px 8px 5px 22px", paddingLeft: `${level * 12 + 8}px`, borderLeft: Active === folder.id ? "2px solid #34d399" : "2px solid transparent" }}
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
            <span className={`shrink-0 transition-transform duration-200 ${ExpandFolder ? "rotate-90" : "rotate-0"} text-[#A8A7A2] dark:text-stone-500 text-[11px]`}>
              {ExpandFolder ? (
                <ChevronDown contentEditable={false} className="text-[11px]" size={11} />
              ) : (
                <ChevronRight contentEditable={false} className="text-[11px]" size={11} />
              )}
            </span>
            {ExpandFolder ? (
              <FolderOpen contentEditable={false} className="text-[#BA7517] shrink-0 text-[13px]" size={13} />
            ) : (
              <Folder contentEditable={false} className="text-[#BA7517] shrink-0 text-[13px]" size={13} />
            )}
            <span className="truncate text-[12.5px]">{folder.name}</span>
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
                flex items-center gap-1.5 pr-2 cursor-pointer
                transition-all duration-150 text-[#6B6A65] dark:text-stone-400
                ${Active && Active === node.id ? "bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#047857] dark:text-emerald-300 font-medium" : "hover:bg-[#d1fae5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400"}
              ${Active === node.id ? "dark:border-emerald-500" : ""}
              `}
              style={{ padding: "5px 8px 5px 22px", paddingLeft: `${level * 12 + 8}px`, borderLeft: Active === node.id ? "2px solid #34d399" : "2px solid transparent" }}
              onClick={() => {
                if (Rename !== node.id) {
                  setActive(node.id);
                  navigate(`${activeView==='cards'?'cards':'notes'}/${node.id}`);
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
              <FileText
                contentEditable={false}
                className={`shrink-0 text-[13px] ${Active === node.id ? "text-[#059669] dark:text-emerald-400" : "text-[#A8A7A2] dark:text-stone-500"}`}
                size={13}
              />
              <span className="truncate text-[12.5px]" contentEditable={Rename === node.id}>
                {node.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}