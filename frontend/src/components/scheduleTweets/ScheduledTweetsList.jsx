import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendar,
  faFilter,
  faChevronDown,
  faCheck,
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Scheduled Tweets
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-3 mb-6">
        {["all", "posted", "unposted"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md font-medium border border-gray-300 ${
              filter === status ? "bg-blue-600 text-white" : "bg-white"
            } transition-all duration-300 shadow-sm`}
            onClick={() => setFilter(status)}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tweets List */}
      <div className="space-y-4">
        {filteredTweets.length === 0 ? (
          <p className="text-center text-gray-500">
            No scheduled tweets found.
          </p>
        ) : (
          filteredTweets.map((tweet) => (
            <motion.div
              key={tweet.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleExpand(tweet.id)}
            >
              {/* Tweet Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between space-x-4">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-500"
                  />
                  <p className="text-gray-700 text-sm truncate max-w-xs">
                    {tweet.tweet_text.length > 50
                      ? tweet.tweet_text.substring(0, 50) + "..."
                      : tweet.tweet_text}
                  </p>
                  {!tweet.posted && (
                    <CountdownTimer scheduledTime={tweet.scheduled_time} />
                  )}
                </div>

                {/* Expand Icon */}
                <motion.div
                  className="cursor-pointer p-2 rounded-md hover:bg-gray-200 transition-all"
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
                    className="mt-3 border-t border-gray-300 pt-3"
                  >
                    <p className="text-sm text-gray-600">{tweet.tweet_text}</p>
                    {tweet.image_url && (
                      <motion.img
                        src={tweet.image_url}
                        alt="Tweet"
                        className="w-full h-40 object-cover rounded-md mt-3"
                        whileHover={{ scale: 1.05 }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status & Clock Icon */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-md border ${
                    tweet.posted
                      ? "bg-green-100 text-green-700 border-green-400"
                      : "bg-yellow-100 text-yellow-700 border-yellow-400"
                  }`}
                >
                  {tweet.posted ? "Posted" : "Scheduled"}
                </span>
                <FontAwesomeIcon
                  icon={tweet.posted ? faCheck : faClock}
                  className="text-blue-500 cursor-pointer"
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
