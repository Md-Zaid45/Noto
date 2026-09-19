import {
  PanelRight,
  PanelRightClose,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn, setLoggedOut } from "../../../store/authSlice";
import { useTheme } from "../../../store/themeContext";

export default function Header({
  view,
  setView,
  ExpandLeftbar,
  setExpandLeftbar,
  ExpandRightbar,
  setExpandRightbar,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);
  const { theme, toggleTheme } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;
  return (
    <nav className="w-full top-0 sticky z-[60] h-12 bg-[#f5f6f5] dark:bg-stone-900 border-b border-[#E8E6E1] dark:border-stone-800 select-none">
      <div className="flex justify-between items-center px-4 h-full">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-[#1C1B22] dark:text-stone-100 font-heading">Noto</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#6B6A65] hover:bg-[#ecfdf5] hover:text-[#059669] dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 rounded-[5px] transition-all duration-150 active:scale-[0.97]"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-[14px] h-[14px]" /> : <Moon className="w-[14px] h-[14px]" />}
          </button>

          {auth.isLoggedIn && (
            <button
              className="text-[#6B6A65] dark:text-stone-400 hover:bg-[#ecfdf5] hover:text-[#059669] dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-all duration-150 cursor-pointer flex items-center p-2 rounded-[5px] active:scale-[0.97]"
              onClick={() => setExpandRightbar((prev) => !prev)}
              aria-label="Toggle Right Sidebar"
            >
              {ExpandRightbar ? (
                <PanelRight className="w-[14px] h-[14px]" />
              ) : (
                <PanelRightClose className="w-[14px] h-[14px]" />
              )}
            </button>
          )}

          {auth.isLoggedIn ? (
            <button
              onClick={async () => {
                await fetch(`${API_URL}/api/v1/users/logout`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                });
                dispatch(setLoggedOut());
                navigate("../login");
              }}
              className="text-[#6B6A65] dark:text-stone-400 hover:text-[#059669] dark:hover:text-emerald-400 p-2 rounded-[5px] transition-all duration-150 hover:bg-[#ecfdf5] dark:hover:bg-emerald-950/30 active:scale-[0.97]"
              title="Logout"
            >
              <LogOut className="w-[14px] h-[14px]" />
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("../login");
              }}
              className="bg-[#059669] dark:bg-emerald-600 text-white px-4 py-1.5 rounded-[6px] font-medium text-[12.5px] hover:bg-[#047857] dark:hover:bg-emerald-700 transition-all duration-150 active:scale-[0.97]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}