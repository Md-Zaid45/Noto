import { useContext } from "react";
import { sidebarContext } from "../../../home";
import { parentFolder } from "./utils";
import { useSelector } from "react-redux";
import { FilePlus, FolderPlus } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function SiderbarHeader({
  fileButtonRef,
  folderButtonRef,
  setShowInputNote,
  setShowInputFolder,
}) {
  const { Active } = useContext(sidebarContext);
  const Notes = useSelector((state) => state.Notes);

  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.07em] text-[#A8A7A2] dark:text-stone-500 font-heading">
        Library
      </span>
      <div className="flex gap-1">
        <Button
          ref={fileButtonRef}
          variant="ghost"
          size="icon"
          className="h-[22px] w-[22px] !text-[#A8A7A2] dark:!text-stone-500 hover:!bg-[#ecfdf5] dark:hover:!bg-emerald-950/30 hover:!text-[#059669] dark:hover:!text-emerald-400"
          title="New Note"
          onClick={() => {
            setShowInputFolder(0);
            setShowInputNote(
              Active[0] === "n" ? parentFolder(Active, Notes) : Active,
            );
          }}
        >
          <FilePlus size={14} />
        </Button>
        <Button
          ref={folderButtonRef}
          variant="ghost"
          size="icon"
          className="h-[22px] w-[22px] !text-[#A8A7A2] dark:!text-stone-500 hover:!bg-[#ecfdf5] dark:hover:!bg-emerald-950/30 hover:!text-[#059669] dark:hover:!text-emerald-400"
          title="New Folder"
          onClick={() => {
            setShowInputNote(0);
            setShowInputFolder(
              Active[0] === "n" ? parentFolder(Active, Notes) : Active,
            );
          }}
        >
          <FolderPlus size={14} />
        </Button>
      </div>
    </div>
  );
}