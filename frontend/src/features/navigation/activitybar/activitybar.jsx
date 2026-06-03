import {
  LayoutDashboard,
  StickyNote,
  Layers3,
  Mail,
  Settings,
} from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { viewContext } from "../../../home";

export default function ActivityBar({ setView }) {
  const navigate = useNavigate();
  const items = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={24} />,
      action: () => {
        navigate("./dashboard");
      },
    },
    {
      name: "Notes",
      icon: <StickyNote size={24} />,
      action: () => {
        const activeTab = localStorage.getItem("tabs") ? JSON.parse(localStorage.getItem("tabs")).activeTab : null;
        if(activeTab) {
          navigate(`./notes/${activeTab}`);
        } else  navigate("./home"); 
      }
    },
    {
      name: "Contact",
      icon: <Mail size={24} />,
      action: () => {},
    },
    {
      name: "Settings",
      icon: <Settings size={24} />,
      action: () => {},
    },
  ];

  return (
    <>
      {/* Navigation Icons */}
      <div className="flex flex-col gap-4 justify-start">
        {items.map((item, index) => (
          <button
            key={index}
            className="
              group
              relative
              p-3
              rounded-2xl
              text-gray-400
              hover:text-white
              hover:bg-indigo-500
              transition-all
              duration-300
            "
            onClick={() => item.action()}
          >
            {item.icon}

            {/* Tooltip */}
            <span
              className="
                absolute
                left-16
                top-1/2
                -translate-y-1/2
                whitespace-nowrap
                bg-black
                text-white
                text-sm
                px-3
                py-1
                rounded-lg
                opacity-0
                group-hover:opacity-100
                transition
                pointer-events-none
              "
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
