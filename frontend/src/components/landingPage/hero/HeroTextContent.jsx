import React from "react";
import { motion } from "framer-motion";

const HeroTextContent = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 md:px-8 my-32">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-4xl font-extrabold text-gray-800"
      >
        Elevate your{" "}
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          social presence
        </span>{" "}
        with our marketing tool
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-800 text-lg mt-4 md:max-w-2xl max-w-lg"
      >
        Grow your online brand with AI-driven insights, automation, and
        engagement tools that take your business to the next level.
      </motion.p>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-800 transition text-white rounded-lg shadow-lg"
      >
        Get Started
      </motion.button>
    </div>
  );
};

export default HeroTextContent;
