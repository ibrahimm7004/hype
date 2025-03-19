import React, { useEffect, useState } from "react";

const RedditFeedPost = ({ post }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const timestamp = post.created_utc;
    const date = new Date(timestamp * 1000);
    const fd = date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setFormattedDate(fd);
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Title */}

      {/* Author & Subreddit */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm border border-gray-200">
          <span className="text-gray-600 text-xs">👤 {post.author}</span>
        </div>
        {/* <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm border border-blue-300">
          <span className="text-blue-600 text-xs">📌 {post.subreddit}</span>
          </div> */}
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>

      {/* Image Preview */}
      {post.domain === "res.cloudinary.com" && post.url && (
        <div className="w-full mb-3">
          <img
            src={post.url}
            alt="Reddit Post"
            className="w-full h-56 object-cover rounded-md border border-gray-200"
          />
        </div>
      )}

      {/* Metadata */}
      <div className="flex justify-between items-center text-gray-600 text-xs">
        <p>📅 {formattedDate}</p>
        <p>⬆ {post.score}</p>
      </div>

      {/* Link to Reddit */}
      <a
        href={`https://www.reddit.com${post.permalink}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 text-blue-600 text-sm font-medium hover:underline"
      >
        🔗 View on Reddit
      </a>
    </div>
  );
};

export default RedditFeedPost;
