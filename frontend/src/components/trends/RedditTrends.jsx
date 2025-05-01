import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fetchData from "../../utils/fetchData";

const RedditTrends = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrends = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setKeywords([]);

    try {
      const res = await fetchData(`/trends/reddit-trends?topic=${topic}`);
      if (res.data.top_keywords.length === 0) {
        setError("No trending keywords found for this topic.");
      } else {
        setKeywords(res.data.top_keywords);
      }
    } catch (err) {
      setError("Failed to fetch trends. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-white px-6 py-16 sm:px-10">
      <motion.div
        className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-2">
          🔥 Trends Explorer
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full"
            placeholder="Enter a topic (e.g. AI, economy, climate)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={fetchTrends}
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Fetching..." : "Analyze"}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="text-red-600 bg-red-100 border border-red-300 p-3 rounded-md text-sm mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {keywords.length > 0 && (
            <motion.div
              className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {keywords.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-3 rounded-xl border border-gray-100 shadow-sm text-center bg-gray-50 hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-bold text-indigo-700 tracking-wide">
                    #{item.word}
                  </p>
                  <p className="text-sm text-gray-500">Count: {item.count}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RedditTrends;
