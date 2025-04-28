import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { FaSyncAlt } from "react-icons/fa"; // Import FontAwesome refresh icon
import fetchData from "../../utils/fetchData";

const GikiNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async (fromRefresh = false) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchData("/giki/giki-news");
      setNews(response.data.news || []);

      // Save to localStorage
      localStorage.setItem(
        "gikiNews",
        JSON.stringify(response.data.news || [])
      );
    } catch (err) {
      console.error(err);
      if (fromRefresh) {
        setError("Failed to refresh news. Please try again later.");
      } else {
        setError("Failed to load news. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedNews = localStorage.getItem("gikiNews");
    if (cachedNews) {
      setNews(JSON.parse(cachedNews));
    } else {
      fetchNews();
    }
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      gsap.from(".news-item", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [news]);

  return (
    <div className="border border-gray-300 rounded-2xl p-6 shadow-md bg-white mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center flex-1">GIKI News</h2>
        <button
          onClick={() => fetchNews(true)}
          className="ml-4 p-2 text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
          title="Refresh News"
        >
          <FaSyncAlt size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.date}</p>
              <p className="text-gray-700 mb-2">
                {item.text.length > 200
                  ? item.text.slice(0, 200) + "..."
                  : item.text}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GikiNews;
