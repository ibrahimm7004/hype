import React, { useState } from "react";
import RedditProfile from "./RedditProfile";
import TwitterProfile from "./TwitterProfile";
import FacebookProfile from "./FacebookProfile";
import InstagramProfile from "../meta/instagram/InstagramProfile";
import { motion } from "framer-motion";

const profiles = [
  { name: "Reddit", component: <RedditProfile />, color: "orange-600" },
  { name: "Twitter", component: <TwitterProfile />, color: "blue-400" },
  { name: "Facebook", component: <FacebookProfile />, color: "blue-600" },
  {
    name: "Instagram",
    component: <InstagramProfile />,
    color: "pink-500",
  },
];

const SocialProfiles = () => {
  const [activeTab, setActiveTab] = useState("Reddit");

  return (
    <div className="w-full bg-gradient-to-br from-pink-100 via-blue-100 to-white rounded-xl p-8  mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-between border-2 bg-white/60 hover:bg-white transition border-gray-200 rounded-full px-10 py-2 mb-6 w-1/2 mx-auto">
        {profiles.map(({ name, color }) => (
          <motion.button
            key={name}
            className={`flex-1 text-md font-medium py-1 transition-all duration-200 ${
              activeTab === name
                ? `bg-${color} text-white rounded-full`
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(name)}
            whileTap={{ scale: 0.98 }}
          >
            {name}
          </motion.button>
        ))}
      </div>

      {/* Active Profile Content */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {profiles.find((profile) => profile.name === activeTab)?.component}
      </motion.div>
    </div>
  );
};

export default SocialProfiles;
