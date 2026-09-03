import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewContext } from "../../../home";

const clickHandler = (tab, navigate) => {
  navigate(`../notes/${tab.id}`);
};

const Tabs = React.memo(function Tabs({ OpenTabs, deleteHandler }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rightPanelOpen, setRightPanelOpen } = useContext(viewContext);

  return (
    <div className="flex items-center h-10 bg-[#f7f8f7] dark:bg-stone-950 border-b border-[#E8E6E1] dark:border-stone-800 px-3 overflow-x-auto gap-1">
      {OpenTabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center gap-[5px] px-3 py-1 cursor-pointer select-none shrink-0 rounded-[6px] transition-all duration-150 ${
            tab.id === id
              ? "bg-white dark:bg-stone-900 border-[0.5px] border-[#E2E0DC] dark:border-stone-700 text-[#1C1B22] dark:text-stone-100 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
              : "bg-transparent border-[0.5px] border-transparent text-[#9B9A96] dark:text-stone-400 font-medium hover:text-[#4A4947] dark:hover:text-stone-300"
          }`}
          style={{ fontSize: "12.5px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "12px", color: "inherit" }}>article</span>
          <div
            className="truncate max-w-[120px]"
            onClick={() => clickHandler(tab, navigate)}
          >
            {tab.name}
          </div>
          <span
            className={`material-symbols-outlined transition-opacity duration-100 text-[11px] text-[#A8A7A2] dark:text-stone-500 ml-[4px] cursor-pointer ${
              tab.id === id ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ fontSize: "11px" }}
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler(tab);
            }}
          >
            close
          </span>
        </div>
      ))}
      <div className="ml-auto flex items-center shrink-0">
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#A8A7A2] dark:text-stone-500 hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 hover:text-[#059669] dark:hover:text-emerald-400 transition-all duration-150"
          title="Toggle right panel"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
            {rightPanelOpen ? 'right_panel_close' : 'right_panel_open'}
          </span>
        </button>
      </div>
    </div>
  );
});

export default Tabs;