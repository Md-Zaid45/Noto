import React, { useState } from "react";
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
  ExpandLeftbar,
  setExpandLeftbar,
  ExpandRightbar,
  setExpandRightbar,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);
  return (
    <nav className="w-full top-0 sticky z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 select-none">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Left Section: Sidebar Toggle & Branding */}
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

        {/* Middle Section: Navigation Links */}
        <div className="hidden sm:flex items-center space-x-8 md:space-x-12">
          {auth.isLoggedIn ? (
            <>
              <NavLink
                to={`/app/${"home"}`}
                className="text-stone-500 hover:text-emerald-700 transition-colors duration-200 flex items-center pt-0.5"
              >
                <Home className="w-5 h-5" />
              </NavLink>
              <NavLink
                to={`/app/${"home"}`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Dashboard
              </NavLink>
              <NavLink
                to={`/app/${"home"}`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Revision
              </NavLink>
              <NavLink
                to={`/app/${"home"}`}
                className="text-stone-500 font-medium hover:text-emerald-700 transition-colors duration-200 text-sm"
              >
                Contact
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
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
              </NavLink>
            </>
          )}
        </div>

        {/* Right Section: Sidebar Toggle & Auth */}
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
