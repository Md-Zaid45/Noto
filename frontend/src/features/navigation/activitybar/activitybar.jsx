import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../store/themeContext";
import { BookOpen, Layers, LayoutDashboard, Mail, Sun, Moon, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ActivityBar({ treeOpen, setTreeOpen }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const activeView = pathname.split("/")[2] || "";

  const items = [
    {
      name: "Notes",
      icon: BookOpen,
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
      icon: Layers,
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
      icon: LayoutDashboard,
      view: "dashboard",
      action: () => {
        navigate("./dashboard");
      },
    },
    {
      name: "Contact",
      icon: Mail,
      view: "contact",
      action: () => {},
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      icon: Settings,
      action: () => {},
    },
  ];

  return (
    <aside className="flex flex-col  items-center w-[47px] bg-[#efeeeb] dark:bg-stone-900 shrink-0 border-r border-[#E8E6E1] dark:border-stone-800">
      <div className="flex flex-col items-center py-3">
        <span className="text-[13px] font-medium text-stone-700 dark:text-white text-center block mb-[10px]">N</span>
        <Button
          variant="ghost"
          size="icon"
          className="w-[32px] h-[32px] !text-stone-500 dark:!text-[#6B6A80] hover:!bg-stone-200 dark:hover:!bg-[#2E2D3A] hover:!text-emerald-600 dark:hover:!text-[#6ee7b7] mb-1.5"
          onClick={() => setTreeOpen(!treeOpen)}
          title="Toggle sidebar"
        >
          {treeOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
        </Button>
        {items.map((item, index) => {
          const isActive = activeView === item.view;
          return (
            <div key={index} className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className={`w-[32px] h-[32px] mt-1 ${
                  isActive
                    ? "!bg-blue-300 dark:!bg-blue-900 !text-stone-900 dark:!text-[#6ee7b7]"
                    : "!text-stone-500 dark:!text-[#6B6A80] hover:!bg-stone-200 dark:hover:!bg-[#2E2D3A] hover:!text-emerald-600 dark:hover:!text-[#6ee7b7]"
                }`}
                onClick={() => item.action()}
                aria-label={item.name}
              >
                <item.icon size={17} />
              </Button>
              <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white dark:bg-[#1C1B22] text-stone-700 dark:text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-stone-200 dark:border-[#E8E6E1] dark:border-stone-800 shadow-sm">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col items-center pb-3">
        <div className="group relative">
          <Button
            variant="ghost"
            size="icon"
            className="w-[32px] h-[32px] !text-stone-500 dark:!text-[#6B6A80] hover:!bg-stone-200 dark:hover:!bg-[#2E2D3A] hover:!text-emerald-600 dark:hover:!text-[#6ee7b7] mb-1"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white dark:bg-[#1C1B22] text-stone-700 dark:text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-stone-200 dark:border-[#E8E6E1] dark:border-stone-800 shadow-sm">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </div>
        {bottomItems.map((item, index) => (
          <div key={index} className="group relative">
            <Button
              variant="ghost"
              size="icon"
              className="w-[32px] h-[32px] !text-stone-500 dark:!text-[#6B6A80] hover:!bg-stone-200 dark:hover:!bg-[#2E2D3A] hover:!text-emerald-600 dark:hover:!text-[#6ee7b7]"
              onClick={() => item.action()}
              aria-label={item.name}
            >
              <item.icon size={17} />
            </Button>
            <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white dark:bg-[#1C1B22] text-stone-700 dark:text-white text-xs font-medium px-2.5 py-1 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-stone-200 dark:border-[#E8E6E1] dark:border-stone-800 shadow-sm">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}