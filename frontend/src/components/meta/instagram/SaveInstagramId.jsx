import React, { useState, useRef, useEffect } from "react";
import {
  FaInstagram,
  FaCheckCircle,
  FaSave,
  FaUserFriends,
  FaUserPlus,
  FaImages,
} from "react-icons/fa";
import gsap from "gsap";
import fetchData from "../../../utils/fetchData";

const SaveInstagramId = () => {
  const [instagram, setInstagram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(
    localStorage.getItem("meta/instagram_authenticated") === "true"
  );
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // Auto-fetch info if already authenticated
    if (saved) {
      fetchInstagramInfo();
    }
  }, []);

  const saveInstagramId = async () => {
    setError("");
    setLoading(true);
    try {
      await fetchData("/meta/instagram/save-id");
      localStorage.setItem("meta/instagram_authenticated", "true");
      setSaved(true);
      fetchInstagramInfo();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save Instagram ID.");
    }
    setLoading(false);
  };

  const fetchInstagramInfo = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetchData("/meta/instagram/info");
      if (res?.data?.id) {
        setInstagram(res.data);
      } else {
        setError("No Instagram info available.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch Instagram info.");
    }
    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 space-y-6"
    >
      <div className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
        <FaInstagram className="text-pink-500 text-3xl" />
        Instagram Business Account
      </div>

      {!saved && (
        <button
          onClick={saveInstagramId}
          className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition"
        >
          {loading ? "Saving..." : "Save Instagram ID"}
        </button>
      )}

      {saved && !instagram && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchInstagramInfo}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            {loading ? "Fetching..." : "Fetch Instagram Info"}
          </button>
        </div>
      )}

      {error && <div className="text-red-500 text-center text-sm">{error}</div>}

      {instagram && (
        <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-inner border">
          <div className="flex items-center gap-4">
            <img
              src={instagram.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-pink-500"
            />
            <div>
              <div className="text-xl font-bold text-gray-800">
                @{instagram.username}
              </div>
              <div className="text-gray-600">{instagram.name}</div>
              <p className="text-sm text-gray-500 mt-1">
                {instagram.biography}
              </p>
            </div>
          </div>

          <div className="flex justify-around mt-6 text-center text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-1">
              <FaUserFriends className="text-blue-500" />
              Followers: {instagram.followers_count}
            </div>
            <div className="flex items-center gap-1">
              <FaUserPlus className="text-green-500" />
              Following: {instagram.follows_count}
            </div>
            <div className="flex items-center gap-1">
              <FaImages className="text-purple-500" />
              Posts: {instagram.media_count}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveInstagramId;
