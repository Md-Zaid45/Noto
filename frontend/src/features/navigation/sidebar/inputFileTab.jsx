import { useEffect, useRef } from "react";
import { LuFilePen, LuFolderClosed } from "react-icons/lu";
import { UiController } from "../../../store/uiController";
import { useDispatch } from "react-redux";
import { handleInput, registerActiveInput } from "./handlers";
import { addFolder } from "../../folders/foldersSlice";
import { addNote } from "../../notes/notesSlice";

export default function Input({
  inputRef,
  ShowInputNote,
  setShowInputNote,
  ShowInputFolder,
  setShowInputFolder,
  folder,
  level,
}) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const padding = ShowInputNote ? level * 12 + 21 : level * 12;
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.value = "";
      ref.current.focus();
    }
  }, [ShowInputFolder, ShowInputNote]);
  useEffect(() => {
    registerActiveInput(
      ShowInputFolder,
      setShowInputFolder,
      ShowInputNote,
      setShowInputNote,
      inputRef,
      UiController,
    );
  }, []);

  return (
    <>
      {ShowInputFolder == folder.id || ShowInputNote == folder.id ? (
        <div
          data-input-file
          ref={inputRef}
          className="flex gap-1 text-[12.5px]"
          style={{ paddingLeft: `${padding}px`, paddingTop: "5px", paddingBottom: "5px" }}
        >
          {ShowInputFolder ? (
            <LuFolderClosed className="text-[#BA7517] dark:text-amber-600 text-sm" />
          ) : (
            <LuFilePen className="text-[#A8A7A2] dark:text-stone-500 text-sm" />
          )}
          <input
            ref={ref}
            className="pl-1 focus:outline-none bg-transparent text-[#1C1B22] dark:text-stone-100 text-[12.5px] placeholder-[#A8A7A2] dark:placeholder-stone-500"
            placeholder="Enter Name"
            onKeyDown={(e) => {
              handleInput(
                e,
                ShowInputFolder,
                setShowInputFolder,
                ShowInputNote,
                setShowInputNote,
                folder,
                dispatch,
                addFolder,
                addNote,
              );
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}