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
      <div className="  bg-white shadow-lg rounded-lg p-6">
        {/* Dynamic Content */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScheduledTweetsList />
        </motion.div>
      </div>
    </div>
  );
};

export default SchedulePost;
