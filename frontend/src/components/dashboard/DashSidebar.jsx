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
} from "react-icons/fa";

const menuItems = [
  {
    name: "Social Profile",
    icon: <FaUser />,
    path: "/authSocialMedia/twitter",
  },
  { name: "Authenticate", icon: <FaLock />, path: "/authSocialMedia" },
  {
    name: "Create Post",
    icon: <FaHome />,
    path: "/authSocialMedia/twitter/post",
  },
  {
    name: "Schedule Post",
    icon: <FaCalendarAlt />,
    path: "/authSocialMedia/twitter/schedule-post",
  },
  //   {
  //     name: "Analytics",
  //     icon: <FaChartBar />,
  //     path: "/authSocialMedia/twitter/analytics",
  //   },
  {
    name: "AI Marketing",
    icon: <FaRobot />,
    path: "/authSocialMedia/twitter/ai-marketing",
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
      className="h-screen w-64 bg-gray-900 text-white flex flex-col p-5 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">📊 Dashboard</h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-800"
              }`}
            >
              <Link to={item.path} className="flex items-center gap-3 w-full">
                {item.icon}
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
