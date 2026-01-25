import { useEffect, useRef } from "react";
import { LuFilePen, LuFolderClosed} from "react-icons/lu";
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
  level
}) {
  console.log("input comp rendered");
  const ref = useRef(null);
  const dispatch = useDispatch();
  const padding=ShowInputNote?level*7+21:level*7
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
        <div data-input-file ref={inputRef} className="flex gap-1 text-sm"
         style={{ paddingLeft: `${padding}px` }}>
          {ShowInputFolder ? (
            <LuFolderClosed className="text-yellow-300 text-lg" />
          ) : (
            <LuFilePen className="text-yellow-300 text-xl" />
          )}
          <input
            ref={ref}
            className="pl-1  focus:outline-none  focus:border focus:rounded-sm "
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
