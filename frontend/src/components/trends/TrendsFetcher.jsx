import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fetchData from "../../utils/fetchData"; // Assuming you have a helper function to handle API requests

const trendTypeDescriptions = {
  hashtags: "Top trending hashtags on the selected platform.",
  topics: "Top trending topics currently being discussed.",
  memes: "Popular memes that are trending.",
  news: "Top trending news articles and stories.",
  challenges: "Trending challenges gaining traction.",
  accounts: "Popular accounts driving engagement.",
  keywords: "Trending keywords that are being searched.",
};

const TrendFetcher = () => {
  const [socialMedia, setSocialMedia] = useState("instagram");
  const [location, setLocation] = useState("Pakistan");
  const [trendType, setTrendType] = useState("hashtags");
  const [num, setNum] = useState(5);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTrends = async () => {
    setLoading(true);
    setTrends([]);
    setErrorMsg("");

    try {
      const response = await fetchData("/trends/get-trends", "POST", {
        social_media: socialMedia,
        location: location,
        trend_type: trendType,
        num: num,
      });
      setTrends(response.data.trends);
    } catch (error) {
      setErrorMsg("Failed to fetch trends. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-100 to-white p-10">
      <motion.div
        className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✨ Top Trend
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <select
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="reddit">Reddit</option>
            <option value="facebook">Facebook</option>
          </select>

          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none"
            placeholder="Enter Location (e.g., Pakistan)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <select
            value={trendType}
            onChange={(e) => setTrendType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none"
          >
            {Object.keys(trendTypeDescriptions).map((type) => (
              <option key={type} value={type}>
                {type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            min={1}
            max={10}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none"
            placeholder="Number of Trends"
          />
        </div>

        <button
          onClick={fetchTrends}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <span className="loader h-4 w-4 border-2 border-white rounded-full animate-spin" />
          )}
          {loading ? "Fetching Trends..." : "Fetch Trends"}
        </button>

        <p className="text-sm text-gray-500 mb-4 mt-4">
          {trendTypeDescriptions[trendType]}
        </p>

        <AnimatePresence>
          {trends.length > 0 && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ul className="space-y-4">
                {trends.map((trend, index) => (
                  <motion.li
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg font-semibold text-gray-800">
                      {trend}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              className="bg-red-100 border border-red-300 text-red-700 rounded-md p-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TrendFetcher;
