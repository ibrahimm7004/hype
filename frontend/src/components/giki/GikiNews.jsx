import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { FaSyncAlt, FaClipboard } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import fetchData from "../../utils/fetchData";

const GikiNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  const fetchNews = async (fromRefresh = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchData("/giki/giki-news");
      setNews(response.data.news || []);
      localStorage.setItem(
        "gikiNews",
        JSON.stringify(response.data.news || [])
      );
    } catch (err) {
      setError(
        fromRefresh ? "Failed to refresh news." : "Failed to load news."
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async (item, index) => {
    setGeneratingIndex(index);
    setGeneratedPost(null);
    try {
      const response = await fetchData("/giki/create-giki-news-post", "POST", {
        news: item,
      });
      setGeneratedPost({ content: response.data.post, item });
    } catch {
      setGeneratedPost({ content: "⚠️ Failed to generate post.", item });
    } finally {
      setGeneratingIndex(null);
    }
  };

  useEffect(() => {
    const cachedNews = localStorage.getItem("gikiNews");
    cachedNews ? setNews(JSON.parse(cachedNews)) : fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      gsap.from(".news-item", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [news]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-center flex-1">
          📰 GIKI News
        </h2>
        <button
          onClick={() => fetchNews(true)}
          className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:rotate-90 transition-transform"
          title="Refresh News"
        >
          <FaSyncAlt size={20} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : news.length === 0 ? (
        <div className="text-center text-gray-500">
          No news available at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item, index) => (
            <div
              key={index}
              className="news-item border-b pb-4 last:border-none"
            >
              <h3 className="text-xl font-medium text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 mb-1">{item.date}</p>
              <p className="text-gray-700 mb-2">
                {item.text.length > 200
                  ? item.text.slice(0, 200) + "..."
                  : item.text}
              </p>
              <div className="flex justify-between items-center text-sm">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Read More →
                </a>
                <button
                  onClick={() => generatePost(item, index)}
                  className="px-3 py-1 text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
                >
                  {generatingIndex === index
                    ? "Generating..."
                    : "Generate Post"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Generated Post */}
      <AnimatePresence>
        {generatedPost && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGeneratedPost(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-indigo-700">
                ✨ Generated Post
              </h3>
              <div className="text-gray-700 space-y-4">
                {["title", "caption", "hashtags", "image_text"].map((field) => (
                  <div key={field} className="flex items-start gap-2">
                    <strong className="w-28 capitalize">
                      {field.replace("_", " ")}:
                    </strong>
                    <span className="flex-1 break-words">
                      {field === "hashtags"
                        ? generatedPost.content[field].join(" ")
                        : generatedPost.content[field]}
                    </span>
                    <FaClipboard
                      className="cursor-pointer text-gray-400 hover:text-indigo-600"
                      title="Copy"
                      onClick={() =>
                        copyToClipboard(
                          field === "hashtags"
                            ? generatedPost.content[field].join(" ")
                            : generatedPost.content[field],
                          field
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              {copiedField && (
                <div className="mt-3 text-green-600 text-sm">
                  ✅ {copiedField.replace("_", " ")} copied to clipboard!
                </div>
              )}

              <button
                onClick={() => setGeneratedPost(null)}
                className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GikiNews;
