import React from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";

const clickHandler = (tab, navigate) => {
  navigate(`../notes/${tab.id}`);
};

const Tabs = React.memo(function Tabs({ OpenTabs, deleteHandler }) {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-end border-b border-gray-200 bg-gray-100/50 px-2 pt-1.5 overflow-x-auto">
      {OpenTabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            group flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg
            cursor-pointer select-none shrink-0
            transition-[background-color,color] duration-150 ease-out
            ${
              tab.id === id
                ? "bg-white text-indigo-600 shadow-sm -mb-px border border-b-0 border-gray-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          <div
            className="truncate max-w-[120px]"
            onClick={() => clickHandler(tab, navigate)}
          >
            {tab.name}
          </div>
          <RxCross2
            className="text-sm opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100 rounded-full p-0.5 transition-opacity duration-100"
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler(tab);
            }}
          />
        </div>
      ))}
    </div>
  );
});

export default Tabs;