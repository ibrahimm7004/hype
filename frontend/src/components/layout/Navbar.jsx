import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaCaretDown,
  FaCaretUp,
  FaHamburger,
  FaLine,
  FaBars,
} from "react-icons/fa";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Profile");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setUserLoggedIn(true);
      const username = localStorage.getItem("user_display_name");
      if (username) {
        setUserName(username);
      }
    }
  }, [userLoggedIn]);

  return (
    <div className="w-full  flex justify-between items-center px-12 bg-white py-3   mx-auto">
      {/* Logo */}
      <div className="flex items-center">
        <img
          className="w-14 h-14 rounded-full border border-gray-300 shadow-md"
          src="https://cdn.pixabay.com/photo/2022/09/18/07/41/logo-7462411_1280.png"
          alt="logo"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-x-10 items-center text-lg font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-gray-800 font-bold tracking-wide"
              : "text-gray-600 hover:text-gray-900 transition duration-300 tracking-wide"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-gray-800 font-bold tracking-wide"
              : "text-gray-600 hover:text-gray-900 transition duration-300 tracking-wide"
          }
        >
          About
        </NavLink>
        {userLoggedIn ? (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-gray-800 font-bold tracking-wide"
                : "text-gray-600 hover:text-gray-900 transition duration-300 tracking-wide"
            }
          >
            Dashboard
          </NavLink>
        ) : (
          <NavLink
            to="/user/login"
            className="text-gray-600 hover:text-gray-900 transition duration-300 tracking-wide"
          >
            Login
          </NavLink>
        )}
      </nav>

      {/* User Profile / CTA */}
      {userLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-full text-gray-700 bg-white/60 hover:bg-gray-200 transition-all duration-300 "
          >
            <FaBars />
          </button>
          <UserMenu isOpen={isOpen} />
        </div>
      ) : (
        <button
          onClick={() => (window.location = "/user/register")}
          className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 bg-white/60 backdrop-blur-md hover:bg-gray-200 transition-all duration-300 shadow-md"
        >
          Sign Up
        </button>
      )}
    </div>
  );
};

export default Navbar;
