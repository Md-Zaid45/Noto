import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../store/themeContext";

export default function ActivityBar({ treeOpen, setTreeOpen }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const activeView = pathname.split("/")[2] || "";

  const items = [
    {
      name: "Notes",
      icon: "note_stack",
      view: "notes",
      action: () => {
        const activeTab = localStorage.getItem("tabs")
          ? JSON.parse(localStorage.getItem("tabs")).activeTab
          : null;
        if (activeTab) {
          navigate(`./notes/${activeTab}`);
        } else navigate("../home");
      },
    },
    {
      name: "Cards",
      icon: "layers",
      view: "cards",
      action: () => {
        const activeTab = localStorage.getItem("tabs")
          ? JSON.parse(localStorage.getItem("tabs")).activeTab
          : null;
        if (activeTab) {
          navigate(`./cards/${activeTab}`);
        } else navigate("./cards");
      },
    },
    {
      name: "Dashboard",
      icon: "dashboard",
      view: "dashboard",
      action: () => {
        navigate("./dashboard");
      },
    },
    {
      name: "Contact",
      icon: "mail",
      view: "contact",
      action: () => {},
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      icon: "settings",
      action: () => {},
    },
  ];

  return (
    <aside className="flex flex-col items-center w-[44px] bg-[#1d2624] shrink-0">
      <div className="flex flex-col items-center py-3">
        <span className="text-[13px] font-medium text-white text-center block mb-[10px]">N</span>
        <button
          onClick={() => setTreeOpen(!treeOpen)}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[#6B6A80] hover:bg-[#2E2D3A] hover:text-[#6ee7b7] transition-all duration-150 mb-2"
          title="Toggle sidebar"
        >
          <span className="material-symbols-outlined" style={{fontSize:'17px'}}>
            {treeOpen ? 'left_panel_close' : 'left_panel_open'}
          </span>
        </button>
        {items.map((item, index) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={index}
              className={`group relative flex items-center justify-center w-[32px] h-[32px] rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-[#2E2D3A] text-[#6ee7b7]"
                  : "text-[#6B6A80] hover:bg-[#2E2D3A] hover:text-[#6ee7b7]"
              }`}
              onClick={() => item.action()}
              aria-label={item.name}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>{item.icon}</span>
              <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1C1B22] dark:bg-stone-950 text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border-[0.5px] border-[#E8E6E1] dark:border-stone-800">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col items-center pb-3">
        <button
          className="group relative flex items-center justify-center w-[32px] h-[32px] rounded-lg text-[#6B6A80] hover:bg-[#2E2D3A] hover:text-[#6ee7b7] transition-all duration-150 mb-1"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1C1B22] dark:bg-stone-950 text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border-[0.5px] border-[#E8E6E1] dark:border-stone-800">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>
        {bottomItems.map((item, index) => (
          <button
            key={index}
            className="group relative flex items-center justify-center w-[32px] h-[32px] rounded-lg text-[#6B6A80] hover:bg-[#2E2D3A] hover:text-[#6ee7b7] transition-all duration-150"
            onClick={() => item.action()}
            aria-label={item.name}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>{item.icon}</span>
            <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1C1B22] text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border-[0.5px] border-[#E8E6E1]">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}