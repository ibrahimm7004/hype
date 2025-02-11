import React, { useState } from "react";
import { motion } from "framer-motion";

const AiMarketing = () => {
  const handleCardClick = (path) => {
    const currentLocation = window.location.pathname;
    console.log("Current Path:", currentLocation);
    window.location = currentLocation + path;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#F7F9FA] p-6">
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-[#1DA1F2] mb-8"
      >
        <h1>AI Marketing Hub</h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xl font-medium text-[#333] mb-12 text-center"
      >
        <h2>What would you like to create today?</h2>
      </motion.div>

      {/* Main Content (Twitter-like Post) */}
      <motion.div
        className="flex flex w-2/3 max-w-4xl space-x-8"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Text Generation Post */}
        <motion.div
          className="flex flex-col bg-white rounded-lg shadow-md p-6 space-y-4 border-l-4 border-[#1DA1F2] cursor-pointer hover:shadow-xl transition-all"
          onClick={() => handleCardClick("/memeText")}
        >
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.pixabay.com/photo/2013/07/13/13/41/robot-161367_640.png"
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#333]">
                AI Marketing Bot
              </span>
              <span className="text-sm text-gray-500">@AIMarketingBot</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#333]">
            Meme Text Generator
          </h3>
          <p className="text-gray-600">
            Generate the best meme captions and text for your memes! Ready to
            have some fun with AI?
          </p>
          <div>
            <motion.button
              className="px-6 mt-6 mb-2 py-2 bg-[#1DA1F2] text-white rounded-full w-fit hover:bg-[#1A91DA]"
              whileHover={{ scale: 1.05 }}
            >
              Generate Text
            </motion.button>
          </div>
        </motion.div>

        {/* Image Generation Post */}
        <motion.div
          className="flex flex-col bg-white rounded-lg shadow-md p-6 space-y-4 border-l-4 border-[#1DA1F2] cursor-pointer hover:shadow-xl transition-all"
          onClick={() => handleCardClick("/memeImage")}
        >
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.pixabay.com/photo/2013/07/13/13/41/robot-161367_640.png"
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#333]">
                AI Marketing Bot
              </span>
              <span className="text-sm text-gray-500">@AIMarketingBot</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#333]">
            Meme Image Generator
          </h3>
          <p className="text-gray-600">
            Create stunning meme images that will make your content shine and
            engage your audience.
          </p>
          <div>
            <motion.button
              className="px-6 mt-6 mb-4 py-2 bg-[#1DA1F2] text-white rounded-full w-fit hover:bg-[#1A91DA]"
              whileHover={{ scale: 1.05 }}
            >
              Generate Image
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-lg text-gray-500">
          Need help?{" "}
          <a href="mailto:support@example.com" className="text-[#1DA1F2]">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default AiMarketing;
