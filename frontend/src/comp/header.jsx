import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaGripLinesVertical } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { LuPanelRightOpen, LuPanelRightClose } from "react-icons/lu";

export default function Header({
  ExpandLeftbar,
  setExpandLeftbar,
  ExpandRightbar,
  setExpandRightbar,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav
      className="flex items-center justify-between fixed top-0 bg-white p-3 shadow-md w-full overflow-hidden h-9 gap-10
    z-10"
    >
      <div
        className="text-lg font-bold hover:text-blue-500 cursor-pointer mr-17"
        onClick={() => {
          setExpandLeftbar((prev) => !prev);
          console.log(ExpandLeftbar);
        }}
      >
        {ExpandLeftbar ? <FaGripLinesVertical /> : <GiHamburgerMenu />}
      </div>

      <div className="hidden sm:flex gap-6">
        <NavLink
          to={`/app/${"home"}`}
          className="text-gray-700 font-bold hover:text-blue-500 transition pt-0.5"
        >
          <FiHome />
        </NavLink>
        <NavLink
          to={`/app/${"revision"}`}
          className="text-gray-700  hover:text-blue-500 transition py-0.5 text-sm"
        >
          Dashboard
        </NavLink>
        <NavLink
          to={`/app/${"home"}`}
          className="text-gray-700  hover:text-blue-500 transition py-0.5 text-sm"
        >
          Revision
        </NavLink>
        <NavLink
          to={`/app/${"home"}`}
          className="text-gray-700  hover:text-blue-500 transition py-0.5 text-sm"
        >
          Contact
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="text-lg font-bold cursor-pointer hover:text-blue-500"
          onClick={() => {
            setExpandRightbar((prev) => !prev);
            console.log(ExpandRightbar);
          }}
        >
          {ExpandRightbar ? <LuPanelRightOpen /> : <LuPanelRightClose />}
        </div>
        {isLoggedIn ? (
          <button className="bg-red-500 text-white  h-4 rounded hover:bg-red-600 transition duration-300 cursor-pointer">
            <FiLogOut></FiLogOut>
          </button>
        ) : (
          <NavLink
            to={"login"}
            className="bg-blue-500 text-white px-4  h-6 rounded hover:bg-blue-600 transition duration-300 cursor-pointer text-sm "
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
