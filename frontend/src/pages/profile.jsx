import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedOut } from "../store/authSlice";
import {
  User,
  Mail,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);
  const notes = useSelector((state) => state.Notes);
  const API_URL = import.meta.env.VITE_API_URL;

  const [recentNotes] = useState(() => {
    const stored = localStorage.getItem("tabs");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.tabs || [];
    }
    return [];
  });

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/v1/users/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    dispatch(setLoggedOut());
    navigate("/login");
  };

  const name = auth.user?.name || "User";
  const email = auth.user?.email || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-full overflow-y-auto bg-[#f9fafb] dark:bg-stone-950 p-6 text-[#111827] dark:text-stone-100">
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#d1fae5] dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[#059669] dark:text-emerald-400 font-heading">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold font-heading text-[#111827] dark:text-stone-100 truncate">
                {name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#6b7280] dark:text-stone-400 shrink-0" />
                <span className="text-sm text-[#6b7280] dark:text-stone-400 truncate">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-[#e5e7eb] dark:border-stone-800 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#6b7280] dark:text-stone-400 tracking-wider uppercase">
              Total Notes
            </p>
            <p className="text-2xl font-bold text-[#111827] dark:text-stone-100 mt-2">
              {notes.length}
            </p>
          </div>
          <div className="p-2 bg-[#d1fae5] dark:bg-emerald-950/30 rounded-lg text-[#1a5c3a] dark:text-emerald-300">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-[#e5e7eb] dark:border-stone-800">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-stone-800">
            <h2 className="text-sm font-bold text-[#111827] dark:text-stone-100 tracking-wider uppercase">
              Recent Notes
            </h2>
          </div>
          <div className="p-6">
            {recentNotes.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {recentNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => navigate(`/home/notes/${note.id}`)}
                    className="min-w-[200px] max-w-[240px] flex-shrink-0 bg-[#f9fafb] dark:bg-stone-800/50 hover:bg-[#d1fae5] dark:hover:bg-emerald-950/30 border border-[#e5e7eb] dark:border-stone-700 hover:border-[#059669] dark:hover:border-emerald-600 rounded-xl p-4 text-left transition-all duration-150 group cursor-pointer flex flex-col"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-[#e5e7eb] dark:border-stone-700 shrink-0">
                        <FileText className="w-4 h-4 text-[#6b7280] dark:text-stone-400 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-[#111827] dark:text-stone-100 truncate group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors">
                        {note.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <ChevronRight className="w-3.5 h-3.5 text-[#d1d5db] dark:text-stone-600 group-hover:text-[#059669] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="w-8 h-8 text-[#d1d5db] dark:text-stone-600 mx-auto mb-2" />
                <p className="text-sm text-[#9ca3af] dark:text-stone-500">
                  No recent notes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-stone-900 border border-[#e5e7eb] dark:border-stone-800 text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-red-950/20 rounded-2xl px-6 py-3.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
