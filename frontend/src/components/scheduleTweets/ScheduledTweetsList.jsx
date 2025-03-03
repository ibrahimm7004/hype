import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faImage,
  faCalendar,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import fetchData from "../../utils/fetchData";
import CountdownTimer from "./CountdownTimer";

const ScheduledTweetsList = () => {
  const [tweets, setTweets] = useState([]);
  const [filter, setFilter] = useState("all");
  const userId = localStorage.getItem("user_id");
  const [expandedTweetId, setExpandedTweetId] = useState(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  const toggleExpand = (tweetId) => {
    setExpandedTweetId(expandedTweetId === tweetId ? null : tweetId);
  };

  const fetchTweets = async () => {
    try {
      const response = await fetchData(
        `/twitter/scheduled-tweets?user_id=${userId}`
      );
      const data = await response.data;
      console.log("Scheduled Tweets:", data);
      if (response.status === 200) {
        setTweets(data.scheduled_tweets);
      } else {
        console.error("Error fetching tweets:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  const filteredTweets = tweets.filter((tweet) => {
    if (filter === "all") return true;
    return filter === "posted" ? tweet.posted : !tweet.posted;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Scheduled Tweets</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["all", "posted", "unposted"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === status ? "bg-blue-600 text-white" : "bg-gray-200"
            } transition-all duration-300`}
            onClick={() => setFilter(status)}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tweets List */}
      <div className="w-full space-y-4 px-4">
        {filteredTweets.length === 0 ? (
          <p className="text-center text-gray-500">
            No scheduled tweets found.
          </p>
        ) : (
          filteredTweets.map((tweet) => (
            <motion.div
              key={tweet.id}
              className="w-full bg-gray-900 text-white shadow-lg rounded-xl p-4 flex flex-col transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleExpand(tweet.id)}
            >
              {/* Tweet Header (Always Visible) */}
              <div className="flex items-center justify-between">
                {/* Countdown Timer & Tweet Preview */}
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-400 text-lg"
                  />
                  <CountdownTimer scheduledTime={tweet.scheduled_time} />
                  <p className="text-gray-300 text-sm truncate max-w-xs">
                    {tweet.tweet_text.length > 50
                      ? tweet.tweet_text.substring(0, 50) + "..."
                      : tweet.tweet_text}
                  </p>
                </div>

                {/* Expand Icon */}
                <motion.div
                  className="cursor-pointer bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-all"
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-300 ${
                      expandedTweetId === tweet.id ? "rotate-180" : ""
                    }`}
                  />
                </motion.div>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedTweetId === tweet.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 border-t border-gray-700 pt-3"
                  >
                    <p className="text-sm text-gray-300">{tweet.tweet_text}</p>
                    {tweet.image_url && (
                      <motion.img
                        src={tweet.image_url}
                        alt="Tweet"
                        className="w-full h-40 object-cover rounded-lg mt-3"
                        whileHover={{ scale: 1.05 }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status & Clock Icon */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    tweet.posted
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-gray-900"
                  }`}
                >
                  {tweet.posted ? "Posted" : "Scheduled"}
                </span>
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-blue-400 cursor-pointer"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledTweetsList;
