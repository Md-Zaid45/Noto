import { useContext } from "react";
import { sidebarContext } from "../../../home";
import { parentFolder } from "./utils";
import { useSelector } from "react-redux";
export default function SiderbarHeader({
  fileButtonRef,
  folderButtonRef,
  setShowInputNote,
  setShowInputFolder,
}) {
 const {Active}=useContext(sidebarContext)
 const Notes=useSelector(state=>state.Notes)
  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.07em] text-[#A8A7A2] dark:text-stone-500">Library</span>
      <div className="flex gap-1">
        <button
          ref={fileButtonRef}
          title="New Note"
          onClick={() => {
            setShowInputFolder(0);
            setShowInputNote(
              Active[0] === "n" ? parentFolder(Active, Notes) : Active,
            );
          }}
          className="w-[22px] h-[22px] flex items-center justify-center rounded-[5px] text-[#A8A7A2] dark:text-stone-500 text-[14px] hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400 transition-all duration-150 active:scale-[0.97]"
        >
          <span className="material-symbols-outlined" style={{fontSize:'14px'}}>note_add</span>
        </button>
        <button
          ref={folderButtonRef}
          title="New Folder"
          onClick={() => {
            setShowInputNote(0);
            setShowInputFolder(
              Active[0] === "n" ? parentFolder(Active, Notes) : Active,
            );
          }}
          className="w-[22px] h-[22px] flex items-center justify-center rounded-[5px] text-[#A8A7A2] dark:text-stone-500 text-[14px] hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400 transition-all duration-150 active:scale-[0.97]"
        >
          <span className="material-symbols-outlined" style={{fontSize:'14px'}}>create_new_folder</span>
        </button>
      </div>
    </div>
  );
}