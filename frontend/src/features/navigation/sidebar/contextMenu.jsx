import { useEffect, useContext } from "react";
import { UiController } from "../../../store/uiController";
import { deleteChildrenNotes, deleteNote } from "../../notes/notesSlice";
import { deleteFolder } from "../../folders/foldersSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleContextMenuAction } from "./handlers";
import { sidebarContext } from "../../../home";
export default function ContextMenu({}) {
  const contextOptions = ["Rename", "Mark for Revision", "Delete"];
  const {
    setRename,
    setActive,
    setShowContextMenu,
    ShowContextMenu,
    ContextMenuPos,
  } = useContext(sidebarContext);
  const Notes = useSelector((state) => state.Notes);
  const Folders = useSelector((state) => state.Folders);

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
          className="absolute z-50 w-40 bg-[#1C1B22] dark:bg-stone-950 text-white text-[12.5px] rounded-[6px] border-[0.5px] border-[#E8E6E1] dark:border-stone-800 py-1"
          style={{
            left: `${ContextMenuPos.x}px`,
            top: `${ContextMenuPos.y}px`,
          }}
        >
          {contextOptions.map((option) => (
            <div
              key={option}
              className="hover:bg-[#2E2D3A] dark:hover:bg-stone-800 text-white py-1.5 pl-3 cursor-pointer transition-all duration-150"
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
