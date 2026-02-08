import { useContext } from "react";
import {
  AiOutlineFolderAdd,
  AiOutlineFileAdd,
  AiOutlineSearch,
} from "react-icons/ai";

import { sidebarContext } from "../../../pages/home";
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
    <div className="flex cursor-pointer gap-3 justify-end mr-2">
      <AiOutlineFileAdd
        className=" text-blue-300 text-[18px]  active:p-0.5 "
        ref={fileButtonRef}
        onClick={() => {
          setShowInputFolder(0);
          setShowInputNote(
            Active[0] === "n" ? parentFolder(Active, Notes) : Active,
          );
        }}
      />
      <AiOutlineFolderAdd
        className=" text-blue-300 text-[20px]  active:p-0.5"
        ref={folderButtonRef}
        onClick={() => {
          setShowInputNote(0);
          setShowInputFolder(
            Active[0] === "n" ? parentFolder(Active, Notes) : Active,
          );
        }}
      />
      <AiOutlineSearch className="text-xl text-blue-300 active:p-0.5" />
    </div>
  );
}
