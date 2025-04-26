import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faChevronDown,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import CountdownTimer from "./CountdownTimer";

const cardVariants = {
  hover: { scale: 1.02, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.08)" },
  tap: { scale: 0.98 },
};

const expandVariants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const ScheduledPostCard = ({ post, isExpanded, onExpand }) => {
  const getTitle = () =>
    post.tweet_text || post.message || post.caption || post.title || "";

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 rounded-2xl p-6 shadow-md cursor-pointer overflow-hidden"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onExpand}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faCalendar}
            className="text-indigo-400 text-lg"
          />
          <h2
            className="font-semibold text-gray-800 text-base line-clamp-1 max-w-xs"
            title={getTitle()}
          >
            {getTitle().length > 60
              ? `${getTitle().substring(0, 60)}...`
              : getTitle()}
          </h2>
          {!post.posted && post.scheduled_time && (
            <div className="flex items-center gap-1 text-sm text-gray-500 w-full">
              <FontAwesomeIcon icon={faClock} />
              <CountdownTimer scheduledTime={post.scheduled_time} />
            </div>
          )}
        </div>

        {/* Expand Icon */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-indigo-600 transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </motion.div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={expandVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-4 space-y-4"
          >
            <p className="text-gray-600 text-sm leading-relaxed">
              {getTitle()}
            </p>

            {post.image_url && (
              <motion.img
                src={post.image_url}
                alt="Preview"
                className="w-full h-56 object-cover rounded-xl bg-white"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {post.url && (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-indigo-600 underline text-sm hover:text-indigo-800"
              >
                View Link
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <span
          className={`px-4 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${
            post.posted
              ? "from-green-200 to-green-100 text-green-800"
              : "from-yellow-200 to-yellow-100 text-yellow-800"
          }`}
        >
          <FontAwesomeIcon
            icon={post.posted ? faCheck : faClock}
            className="mr-1"
          />
          {post.posted ? "Posted" : "Scheduled"}
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {post.platform}
        </span>
      </div>
    </motion.div>
  );
};

export default ScheduledPostCard;
