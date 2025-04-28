import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faChevronDown,
  faClock,
  faCheck,
  faThumbsUp,
  faComment,
  faShare,
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
      className="bg-white rounded-xl p-4 shadow-md cursor-pointer overflow-hidden border border-gray-200 max-w-xs w-full"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onExpand}
    >
      {/* Countdown Timer at the top */}
      {post.scheduled_time && !post.posted && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          <CountdownTimer scheduledTime={post.scheduled_time} />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg text-gray-800">
            {post.user_name}
          </h2>
          <div className="flex items-center text-xs text-gray-500">
            <span>@{post.user_username}</span> •{" "}
            <span>{new Date(post.scheduled_time).toLocaleDateString()}</span>
          </div>
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

      {/* Post Content */}
      <div className="mt-2">
        <h3
          className="font-medium text-gray-800 text-sm line-clamp-2"
          title={getTitle()}
        >
          {getTitle().length > 100
            ? `${getTitle().substring(0, 100)}...`
            : getTitle()}
        </h3>

        {/* Image or Media Preview */}
        {post.image_url && (
          <motion.img
            src={post.image_url}
            alt="Preview"
            className="mt-2 w-full h-60 object-cover rounded-lg bg-white"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* External Link */}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 underline text-xs hover:text-indigo-800 mt-2"
          >
            View Link
          </a>
        )}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={expandVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-2 space-y-2"
          >
            <p className="text-gray-600 text-xs">{getTitle()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (Interactions) */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-3 text-xs text-gray-500">
        <div className="flex gap-3">
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
            <FontAwesomeIcon icon={faThumbsUp} />
            {/* <span>{post.likes || 0}</span> */}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
            <FontAwesomeIcon icon={faComment} />
            {/* <span>{post.comments || 0}</span> */}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
            <FontAwesomeIcon icon={faShare} />
            {/* <span>{post.shares || 0}</span> */}
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            post.posted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <FontAwesomeIcon
            icon={post.posted ? faCheck : faClock}
            className="mr-1"
          />
          {post.posted ? "Posted" : "Scheduled"}
        </span>
      </div>
    </motion.div>
  );
};

export default ScheduledPostCard;
