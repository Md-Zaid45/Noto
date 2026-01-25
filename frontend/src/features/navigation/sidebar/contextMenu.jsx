import { useEffect, useContext } from "react";
import { UiController } from "../../../store/uiController";
import { sidebarContext } from "../../../pages/home";

import { deleteChildrenNotes, deleteNote } from "../../notes/notesSlice";
import { deleteFolder } from "../../folders/foldersSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleContextMenuAction } from "./handlers";
export default function ContextMenu({
}) {
  const contextOptions = ["Rename", "Mark for Revision", "Delete"];
  //console.log("this is contextmenu for id:", ShowContextMenu);
  const {setRename, setActive ,setShowContextMenu,
  ShowContextMenu,ContextMenuPos} = useContext(sidebarContext);
  const { Notes, Folders } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    UiController.sidebarContextMenu = {
      close: () => setShowContextMenu(null),
    };

    return () => {
      UiController.sidebarContextMenu = null;
    };
  }, []);

  return (
    <>
      {ShowContextMenu ? (
        <div
          data-context-menu
          className="absolute rounded-sm z-50 w-40 bg-black text-white text-sm"
          style={{
            left: `${ContextMenuPos.x}px`,
            top: `${ContextMenuPos.y}px`,
          }}
        >
          {contextOptions.map((option) => (
            <div
              key={option}
              className={`hover:bg-gray-600  '} shadow-2xl text-white py-1  pl-2 shadow-gray-600 cursor-pointer`}
              onClick={() => {
                handleContextMenuAction(
                  option,
                  ShowContextMenu,
                  setShowContextMenu,
                  deleteFolder,
                  deleteChildrenNotes,
                  dispatch,
                  setRename,
                  deleteNote,
                  Notes,
                  Folders,
                  setActive,
                );
              }}
            >
              {option}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
