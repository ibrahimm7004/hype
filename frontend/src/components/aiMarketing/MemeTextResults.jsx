import React from "react";
import { motion } from "framer-motion";

const MemeTextResults = ({ text, handleRegenerate }) => {
  return (
    <div className="flex flex-col items-center bg-[#F7F9FA] min-h-screen p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-[#1DA1F2] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Results
      </motion.h1>

      {/* Result Container */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl space-y-6">
        {/* Display Generated Text */}
        <div className="p-4 border rounded-lg bg-gray-100 text-lg font-medium text-gray-800">
          {text ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              📝 {text}
            </motion.p>
          ) : (
            <p className="text-gray-500 italic">No meme text generated yet.</p>
          )}
        </div>

        {/* Regenerate Button */}
        <motion.button
          onClick={handleRegenerate}
          whileHover={{ scale: 1.05 }}
          className="w-full bg-[#FF9900] text-white py-3 rounded-lg shadow-lg hover:bg-[#E68600] transition"
        >
          🔄 Regenerate
        </motion.button>
      </div>
    </div>
  );
};

export default MemeTextResults;
