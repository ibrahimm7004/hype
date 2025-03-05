import React, { useState } from "react";
import RedditProfile from "./RedditProfile";
import TwitterProfile from "./TwitterProfile";
import FacebookProfile from "./FacebookProfile";
import InstaProfile from "./InstaProfile";
import { motion } from "framer-motion";

const profiles = [
  { name: "Reddit", component: <RedditProfile />, color: "text-orange-600" },
  { name: "Twitter", component: <TwitterProfile />, color: "text-blue-400" },
  { name: "Facebook", component: <FacebookProfile />, color: "text-blue-600" },
  { name: "Instagram", component: <InstaProfile />, color: "text-pink-500" },
];

const SocialProfiles = () => {
  const [activeTab, setActiveTab] = useState("Reddit");

  return (
    <div className="w-full  bg-white shadow-xl rounded-lg p-6">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b pb-3">
        {profiles.map(({ name, color }) => (
          <motion.button
            key={name}
            className={`flex-1 text-lg font-semibold py-2 transition-all ${
              activeTab === name
                ? `${color} border-b-2 border-current`
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(name)}
            whileTap={{ scale: 0.95 }}
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
