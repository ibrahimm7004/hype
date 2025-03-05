import React, { useState } from "react";
import RedditCreatePost from "./RedditCreatePost";
import TwitterCreatePost from "./TwitterCreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit, faTwitter } from "@fortawesome/free-brands-svg-icons";

const CreatePost = () => {
  const [platform, setPlatform] = useState("reddit");

  return (
    <div className=" mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Create a Post</h1>

      {/* Toggle Switch */}
      <div className="flex justify-center bg-gray-100 rounded-full p-1 mb-6 gap-x-4">
        <button
          onClick={() => setPlatform("reddit")}
          className={`flex items-center px-4 py-2 rounded-full transition duration-300 ${
            platform === "reddit"
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          <FontAwesomeIcon icon={faReddit} className="mr-2" /> Reddit
        </button>
        <button
          onClick={() => setPlatform("twitter")}
          className={`flex items-center px-4 py-2 rounded-full transition duration-300 ${
            platform === "twitter"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2" /> Twitter
        </button>
      </div>

      {/* Post Creation Forms */}
      <div className="transition-all duration-500 ease-in-out">
        {platform === "reddit" ? <RedditCreatePost /> : <TwitterCreatePost />}
      </div>
    </div>
  );
};

export default CreatePost;
