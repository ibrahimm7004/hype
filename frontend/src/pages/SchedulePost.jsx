import React, { useState } from "react";
import ScheduledTweetsList from "../components/scheduleTweets/ScheduledTweetsList";
import ScheduleTweet from "../components/scheduleTweets/ScheduleTweet";
import { motion } from "framer-motion";
import ScheduleRedditPost from "../components/schedule/reddit/ScheduleRedditPost";

const SchedulePost = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Card Container */}
      <div className=" w-2/3 bg-white shadow-lg rounded-lg p-6">
        {/* Toggle Tabs */}
        <div className="flex justify-between border-b pb-2">
          {["list", "new"].map((tab) => (
            <motion.button
              key={tab}
              className={`flex-1 py-2 text-lg font-semibold transition-all ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "list" ? "Scheduled Tweets" : "New Tweet"}
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* {activeTab === "list" ? <ScheduledTweetsList /> : <ScheduleTweet />} */}
          {activeTab === "list" ? (
            <ScheduledTweetsList />
          ) : (
            <ScheduleRedditPost />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SchedulePost;
