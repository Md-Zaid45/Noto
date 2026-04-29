import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import {
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
  Home,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn, setLoggedOut } from "../../../store/authSlice";

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

  return (
    <nav className="w-full top-0 sticky z-50 h-13 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 select-none">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          {auth.isLoggedIn && (
            <div
              className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center"
              onClick={() => setExpandLeftbar((prev) => !prev)}
            >
              {ExpandLeftbar ? (
                <PanelLeft className="w-6 h-6" />
              ) : (
                <PanelLeftClose className="w-6 h-6" />
              )}
            </div>
          )}
          <div className="text-xl font-bold tracking-tighter text-stone-900 hidden md:block">
            Noto
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-8 md:space-x-12">
          {auth.isLoggedIn ? (
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
              <button
                onClick={() => setView("note")}
                className={`
                  px-4 py-1 text-sm font-medium rounded-md transition-all duration-200
                  ${
                    view === "note"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }
                `}
              >
                Notes
              </button>
              <button
                onClick={() => setView("card")}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${
                    view === "card"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }
                `}
              >
                Cards
              </button>
            </div>
          ) : (
            <>
              {/* <NavLink
                to={`/`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Features
              </NavLink>
              <NavLink
                to={`/`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Templates
              </NavLink>
              <NavLink
                to={`/`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Pricing
              </NavLink> */}
            </>
          )}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {auth.isLoggedIn && (
            <div
              className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center"
              onClick={() => setExpandRightbar((prev) => !prev)}
            >
              {ExpandRightbar ? (
                <PanelRight className="w-6 h-6" />
              ) : (
                <PanelRightClose className="w-6 h-6" />
              )}
            </div>
          )}

          {auth.isLoggedIn ? (
            <button
              onClick={() => {
                dispatch(setLoggedOut());
                navigate("../login");
              }}
              className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg font-semibold tracking-tight active:scale-95 duration-150 ease-in-out transition-all flex items-center justify-center hover:bg-red-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("../login");
              }}
              className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold text-sm tracking-tight active:scale-95 duration-150 ease-in-out transition-transform flex items-center justify-center"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}