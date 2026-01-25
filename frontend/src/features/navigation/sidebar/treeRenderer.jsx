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
export default function Tree({
  folder,level=-1
}) {
  console.log("Tree comp rendered");
  level+=1
  const { Active, setActive, setContextMenuPos, Rename, setRename ,ShowContextMenu,
  setShowContextMenu} =
    useContext(sidebarContext);
  const dispatch = useDispatch();
  const [ExpandFolder, setExpandFolder] = useState(
    folder.id === "r" ? true : false,
  );
  console.log("folder", ExpandFolder, "active", Active);
  const {
    activeRef,
    renameRef,
    ShowInputFolder,
    ShowInputNote,
    setShowInputNote,
    setShowInputFolder,
    inputRef,
  } = useContext(treeContext);
  console.log("Rename in tree :", Rename);
  function toggleExpand(id) {
    id && setExpandFolder((prev) => !prev);
  }

  return (
    <div className="">
      <div className={`${folder.parentFolderId ? "w-2" : ""} `}></div>
      <div className="text-[13.5px] ">
        {folder.id && folder.id != "r" && (
          <div
            draggable
            ref={Rename === folder.id ? renameRef : null}
            contentEditable={Rename === folder.id}
            className={`text-white flex gap-1 cursor-pointer focus:outline-none
    focus:bg-gray-800
    focus:ring-1 focus:ring-blue-300 ${
      Active && Active === folder.id ? "bg-gray-500 overflow-visible" : ""
    }`}
    style={{ paddingLeft: `${level*7}px` }}
            onClick={() => {
              if (Rename !== folder.id) {
                console.log(folder.id);
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
            // onDragStart={(e)=>console.log("drag",folder.name,e.target)}
            // onDragOver={(e)=>{console.log('over',folder.name,e.target)}}
            // onDrop={(e)=>console.log("drop",folder.name,e.target)}
            // onDragEnd={(e)=>console.log("drag end",folder.name,e.target)}
          >
            {ExpandFolder ? (
              <>
                <BiChevronDown contentEditable={false} className="text-lg  " />
                <LuFolderOpen
                  contentEditable={false}
                  className="text-white text-lg "
                />
              </>
            ) : (
              <>
                <BiChevronRight contentEditable={false} className="text-lg " />
                <LuFolderClosed
                  contentEditable={false}
                  className="text-white text-lg "
                />
              </>
            )}
            <div>{folder.name}</div>
          </div>
        )}
        {ShowInputNote === folder.id || ShowInputFolder === folder.id ? (
          <Input
            inputRef={inputRef}
            setShowInputFolder={setShowInputFolder}
            ShowInputFolder={ShowInputFolder}
            ShowInputNote={ShowInputNote}
            setShowInputNote={setShowInputNote}
            folder={folder}
            level={level}
          />
        ) : (
          ""
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
              className={`pl-8 flex gap-1 text-white cursor-pointer focus:outline-none
   focus:bg-gray-800
    focus:ring-1 focus:ring-blue-300  ${
      Active && Active === node.id ? "bg-gray-500  " : ""
    }`}
     style={{ paddingLeft: `${level*7+21}px` }}
              onClick={() => {
                if (Rename !== node.id) {
                  console.log(node.id);
                  setActive(node.id);
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
              <LuFilePen
                contentEditable={false}
                className="text-green-400 text-lg"
              />
              <div contentEditable={Rename === node.id}>{node.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
