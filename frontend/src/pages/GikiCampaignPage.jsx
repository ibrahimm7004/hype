import React, { useState } from "react";
import { gsap } from "gsap";
import GikiEvents from "../components/giki/GikiEvents";
import GikiNews from "../components/giki/GikiNews";

const GikiCampaignPage = () => {
  const [activeTab, setActiveTab] = useState("events");

  // Handle the toggle between events and news
  const handleToggle = (tab) => {
    setActiveTab(tab);

    // GSAP animation for transition
    gsap.fromTo(
      `#${tab === "events" ? "news" : "events"}`,
      { opacity: 1, x: 0 },
      { opacity: 0, x: -100, duration: 0.5 }
    );

    gsap.fromTo(
      `#${tab}`,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.5 }
    );
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-pink-100 via-blue-100 to-white rounded-lg p-4">
      <div className="flex space-x-6 mb-6">
        <button
          onClick={() => handleToggle("events")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg focus:outline-none transition-all duration-300 hover:bg-blue-600"
        >
          Events
        </button>
        <button
          onClick={() => handleToggle("news")}
          className="px-6 py-2 bg-green-500 text-white rounded-lg focus:outline-none transition-all duration-300 hover:bg-green-600"
        >
          News
        </button>
      </div>

      <div className="w-full max-w-3xl">
        {activeTab === "events" && (
          <div id="events" className={`transition-opacity duration-500 `}>
            <GikiEvents />
          </div>
        )}
        {activeTab === "news" && (
          <div id="news" className={`transition-opacity duration-500 `}>
            <GikiNews />
          </div>
        )}
      </div>
    </div>
  );
};

export default GikiCampaignPage;
