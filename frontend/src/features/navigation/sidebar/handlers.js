import { childrenIds } from "./utils";
import { menuPosition } from "./conextMenuPos";
import { deleteNotesContent } from "../../notes/notesContentSlice";

export function handleInput(
  e,
  ShowInputFolder,
  setShowInputFolder,
  ShowInputNote,
  setShowInputNote,
  folder,
  dispatch,
  addFolder,
  addNote,
) {
  if (e.key === "Enter" && e.target.value) {
    if (ShowInputNote) {
      dispatch(addNote({ name: e.target.value, folderId: folder.id }));

      setShowInputNote(null);
      console.log("this is input tab", ShowInputNote);
    }
    if (ShowInputFolder) {
      dispatch(
        addFolder({
          name: e.target.value,
          parentFolderId: folder.id,
        }),
      );

      setShowInputFolder(null);
      console.log("this is input tab", ShowInputFolder);
    }
  }
}

export function registerActiveInput(
  ShowInputFolder,
  setShowInputFolder,
  ShowInputNote,
  setShowInputNote,
  inputRef,
  UiController,
) {
  if (ShowInputFolder)
    UiController.activeInput = {
      close: () => {
        setShowInputFolder(null);
      },
    };
  else if (ShowInputNote)
    UiController.activeInput = {
      ref: inputRef,
      close: () => {
        setShowInputNote(null);
      },
    };
  return () => (UiController.activeInput = null);
}

export function handleContextMenuAction(
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
) {
  if (ShowContextMenu && option === "Rename") {
    setRename(ShowContextMenu);
  } else if (ShowContextMenu) {
    if (ShowContextMenu[0] === "n") {
      dispatch(deleteNotesContent([ShowContextMenu]));
      dispatch(deleteNote([ShowContextMenu]));
    } else if (ShowContextMenu[0] === "f") {
      let ids = childrenIds(ShowContextMenu, Notes, Folders);
      console.log(ids);
      dispatch(deleteNotesContent(ids));
      dispatch(deleteFolder(ids));
      dispatch(deleteChildrenNotes(ids));
    }
    setActive("r");
  }
  setShowContextMenu(null);
}

export function keydownHandler(
  e,
  Rename,
  dispatch,
  renameFolder,
  renameNote,
  setRename,
  node,
) {
  if (Rename !== node.id) return;

  if (e.key === "Enter") {
    e.preventDefault();
    if (node.type == "folder")
      dispatch(
        renameFolder({
          id: node.id,
          name: e.currentTarget.innerText,
        }),
      );
    else if (node.type == "file")
      dispatch(
        renameNote({
          id: node.id,
          name: e.currentTarget.innerText,
        }),
      );
    setRename(null);
  }

  if (e.key === "Escape") {
    e.preventDefault();
    e.currentTarget.innerText = node.name;
    setRename(null);
  }
}

export function onContextHandler(
  e,
  node,
  setActive,
  setShowContextMenu,
  setContextMenuPos,
) {
  e.preventDefault();
  setActive(node.id);
  setShowContextMenu(node.id);
  setContextMenuPos(menuPosition(e));
}
