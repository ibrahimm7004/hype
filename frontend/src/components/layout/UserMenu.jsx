import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaCaretDown, FaCaretUp } from "react-icons/fa";

const UserMenu = ({ isOpen }) => {
  return (
    <div className="relative inline-block text-left z-50">
      {/* Dropdown Menu with Animation */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute -left-20  mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden  transform"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <ul className="divide-y divide-gray-200">
          <li>
            <a
              href="/user/profile"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <FaUser className="text-blue-500" />
              View Profile
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location = "/user/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default UserMenu;
