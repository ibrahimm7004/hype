import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaChartBar,
  FaRobot,
  FaLock,
  FaUser,
  FaStar,
  FaAngular,
} from "react-icons/fa";
import { icon } from "@fortawesome/fontawesome-svg-core";

const menuItems = [
  {
    name: "Profile",
    path: null,
  },
  {
    name: "Social Profile",
    icon: <FaUser />,
    path: "/social-platform/profiles",
  },
  { name: "Authenticate", icon: <FaLock />, path: "/social-platform" },
  {
    name: "Create Post",
    icon: <FaHome />,
    path: "/social-platform/create-post",
  },
  {
    name: "Schedule Post",
    icon: <FaCalendarAlt />,
    path: "/social-platform/twitter/schedule-post",
  },
  //   {
  //     name: "Analytics",
  //     icon: <FaChartBar />,
  //     path: "/social-platform/twitter/analytics",
  //   },
  {
    name: "AI",
    path: null,
  },
  {
    name: "Text Gen",
    icon: <FaRobot />,
    path: "/social-platform/twitter/ai-marketing/memeText",
  },
  {
    name: "Meme Gen",
    icon: <FaRobot />,
    path: "/social-platform/twitter/ai-marketing/memeImage",
  },
  {
    name: "GIKI",
    path: null,
  },
  {
    name: "Campaign",
    icon: <FaHome />,
    path: "/giki",
  },
];

const DashSidebar = () => {
  const location = useLocation(); // Get current route
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true); // Mark as loaded after first render
  }, []);

  return (
    <motion.div
      initial={hasLoaded ? { opacity: 0 } : { x: 0 }} // Slide only on first load
      animate={{ x: 0, opacity: 1 }} // Fade effect on navigation
      transition={{ duration: 0.5 }}
      className="h-screen w-64 bg-gradient-to-b from-purple-100 via-blue-100 to-white text-gray-800 flex flex-col p-5 shadow-lg"
    >
      <h2
        className="text-2xl font-bold text-center mb-6 cursor-pointer "
        onClick={() => (window.location = "/dashboard")}
      >
        Dashboard
      </h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          if (item.path == null) {
            return (
              <motion.div key={index}>
                <p className="text-gray-500 mt-2 px-3 font-bold">{item.name}</p>
              </motion.div>
            );
          }
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 px-3 ml-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              <Link to={item.path} className="flex items-center gap-3 w-full">
                {/* {item.icon} */}
                <span>{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default DashSidebar;
