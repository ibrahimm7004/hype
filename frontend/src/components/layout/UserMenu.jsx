import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

const dropdownVariants = {
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const UserMenu = ({ isOpen }) => {
  return (
    <div className="relative z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
          >
            <ul className="divide-y divide-gray-100">
              <li>
                <a
                  href="/user/profile"
                  className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
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
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 text-sm font-medium transition-all"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
