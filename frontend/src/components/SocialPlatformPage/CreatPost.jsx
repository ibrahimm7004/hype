import React, { useState, useEffect, useRef } from "react";
import RedditCreatePost from "./RedditCreatePost";
import TwitterCreatePost from "./TwitterCreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { gsap } from "gsap";

const CreatePost = () => {
  const [platform, setPlatform] = useState("reddit");
  const formRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    gsap.from(toggleRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [platform]);

  return (
    <div className=" w-2/3  mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Create a Post
      </h1>

      {/* Toggle Switch */}
      <div
        ref={toggleRef}
        className="flex justify-center bg-gray-100 rounded-full p-2 mb-8 gap-x-4 shadow-inner"
      >
        <button
          onClick={() => setPlatform("reddit")}
          className={`flex items-center px-5 py-2 rounded-full transition duration-300 font-medium ${
            platform === "reddit"
              ? "bg-orange-500 text-white shadow-lg"
              : "text-gray-600 hover:text-orange-500"
          }`}
        >
          <FontAwesomeIcon icon={faReddit} className="mr-2" />
          Reddit
        </button>
        <button
          onClick={() => setPlatform("twitter")}
          className={`flex items-center px-5 py-2 rounded-full transition duration-300 font-medium ${
            platform === "twitter"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2" />
          Twitter
        </button>
      </div>

      {/* Post Creation Forms */}
      <div ref={formRef}>
        {platform === "reddit" ? <RedditCreatePost /> : <TwitterCreatePost />}
      </div>
    </div>
  );
};

export default CreatePost;
