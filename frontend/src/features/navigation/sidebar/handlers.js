import { childrenIds } from "./utils";
import { menuPosition } from "./conextMenuPos";
import { deleteNotesContent } from "../../notes/notesContentSlice";
import {
  createFolderAsync,
  deleteFoldersAsync,
  updateFolderAsync,
} from "../../folders/foldersSlice";
import { nanoid } from "@reduxjs/toolkit";
import {
  createNoteAsync,
  deleteNotesAsync,
  updateNoteAsync,
} from "../../notes/notesSlice";

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
    const tempId = nanoid(8);
    let folderId = folder.id;
    if (folder.id === "r") folderId = null;
    if (ShowInputNote) {
      dispatch(addNote({ name: e.target.value, folderId: folder.id, tempId }));
      dispatch(createNoteAsync({ name: e.target.value, folderId, tempId }));
      setShowInputNote(null);
      console.log("this is input tab", ShowInputNote);
    }
    if (ShowInputFolder) {
      dispatch(
        addFolder({
          name: e.target.value,
          parentFolderId: folder.id,
          tempId,
        }),
      );
      dispatch(
        createFolderAsync({
          name: e.target.value,
          parentFolderId: folderId,
          tempId,
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
    setRename(ShowContextMenu.id);
  } else if (ShowContextMenu && option === "Delete") {
    if (ShowContextMenu.type === "file") {
      console.log(ShowContextMenu);
      dispatch(deleteNotesContent([ShowContextMenu]));
      dispatch(deleteNote(ShowContextMenu.id));
      dispatch(deleteNotesAsync([ShowContextMenu.id]));
    } else if (ShowContextMenu.type === "folder") {
      let ids = childrenIds(ShowContextMenu.id, Notes, Folders);
      console.log("folder deletion in handler hit", ids);
      dispatch(deleteNotesContent(ids));
      dispatch(deleteFolder(ids));
      dispatch(deleteChildrenNotes(ids));
      dispatch(deleteFoldersAsync(ids));
      dispatch(deleteNotesAsync(ids));
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
    if (node.type == "folder") {
      dispatch(
        renameFolder({
          id: node.id,
          name: e.currentTarget.innerText,
        }),
      );
      dispatch(
        updateFolderAsync({ id: node.id, name: e.currentTarget.innerText }),
      );
    } else if (node.type == "file") {
      dispatch(
        renameNote({
          id: node.id,
          name: e.currentTarget.innerText,
        }),
      );
      dispatch(
        updateNoteAsync({ name: e.currentTarget.innerText, id: node.id }),
      );
    }
    console.log("handler", node.id);
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
  setShowContextMenu({ id: node.id, type: node.type });
  setContextMenuPos(menuPosition(e));
}
