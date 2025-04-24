import React, { useEffect, useRef, useState } from "react";
import { FaUserFriends, FaUserPlus, FaImages, FaSync } from "react-icons/fa";
import gsap from "gsap";
import fetchData from "../../../utils/fetchData";

const STORAGE_KEY = "meta/instagram_profile";

const InstagramProfile = () => {
  const [instagram, setInstagram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef();

  const fetchFromBackend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchData("/meta/instagram/info");
      if (res?.data?.id) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        setInstagram(res.data);
      } else {
        setError("Instagram profile not available.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch Instagram info.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setInstagram(JSON.parse(cached));
        setLoading(false);
      } catch {
        console.error("Failed to parse cached Instagram data.");
        fetchFromBackend();
      }
    } else {
      fetchFromBackend();
    }
  }, []);

  useEffect(() => {
    if (instagram) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [instagram]);

  if (loading)
    return <div className="text-center text-sm text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center text-sm text-red-500 mt-4">{error}</div>;

  return (
    <div
      ref={containerRef}
      className="mt-6 p-6 bg-gray-50 rounded-xl shadow-inner border space-y-4"
    >
      <div className="flex justify-between items-center">
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
            <p className="text-sm text-gray-500 mt-1">{instagram.biography}</p>
          </div>
        </div>

        <button
          onClick={fetchFromBackend}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
          title="Refresh"
        >
          <FaSync />
        </button>
      </div>

      <div className="flex justify-around mt-4 text-center text-sm text-gray-700 font-medium">
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
  );
};

export default InstagramProfile;
