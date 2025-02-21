import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { use } from "react";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { FaUser, FaSignOutAlt, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Profile");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setUserLoggedIn(true);
      const username = localStorage.getItem("user_display_name");
      if (username) {
        setUserName(localStorage.getItem("user_display_name"));
      }
    }
  }, [userLoggedIn]);
  const linksStyle =
    "text-md text-gray-500 cursor-pointer hover:text-gray-700 transition duration-300 hover:-translate-y-1 tracking-widest";
  return (
    <div className="w-full flex justify-between items-center px-10 py-4 items-center mt-4">
      {/* logo  */}
      <div>
        <img
          className="w-12 h-12 rounded-full"
          src="https://cdn.pixabay.com/photo/2022/09/18/07/41/logo-7462411_1280.png"
          alt="logo"
        />
      </div>
      {/* nav links */}
      <nav className="border border-gray-300 rounded-md bg-gray-50 flex gap-x-10 py-4 px-20">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : linksStyle
          }
        >
          Home
        </NavLink>
        {/* <NavLink
          to="/social-platform"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : linksStyle
          }
        >
          SoicalMedia
        </NavLink> */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : linksStyle
          }
        >
          About
        </NavLink>
        {userLoggedIn ? (
          <NavLink
            to="/social-platform/twitter"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : linksStyle
            }
          >
            Dashboard
          </NavLink>
        ) : (
          <NavLink to="/user/login" className={linksStyle}>
            Login
          </NavLink>
        )}
      </nav>

      {/* cto  */}

      {userLoggedIn ? (
        <div className=" relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className=" flex items-center gap-2 px-4 py-2 border-[1px] rounded-lg  hover:bg-blue-700 hover:text-white transition duration-300"
          >
            <FaUser className="text-lg" />
            <span>{userName}</span>
            {isOpen ? <FaCaretUp /> : <FaCaretDown />}
          </button>
          <UserMenu isOpen={isOpen} />
        </div>
      ) : (
        <button
          onClick={() => (window.location = "/user/register")}
          className="border-[1px] border-gray-300 rounded-full px-6 py-2 text-gray-600 hover:-translate-y-1 transition hover:bg-purple-500 hover:text-white"
        >
          SignUp
        </button>
      )}
    </div>
  );
};

export default Navbar;
