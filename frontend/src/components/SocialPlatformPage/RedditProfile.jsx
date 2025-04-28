import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import {
  FaReddit,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaSyncAlt,
  FaUserFriends,
  FaImages,
} from "react-icons/fa";
import fetchData from "../../utils/fetchData";
import RedditFeed from "./RedditFeed";

const STORAGE_KEY = "meta/reddit_profile";

const RedditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const user_id = localStorage.getItem("user_id");
      const storedProfile = localStorage.getItem(STORAGE_KEY);

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setLoading(false);
        return;
      }

      const profileData = await fetchData(
        `/reddit/profile?user_id=${user_id}`,
        "GET"
      );

      if (profileData?.data) {
        setProfile(profileData.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData.data));
      } else {
        setError("Invalid profile data received.");
      }
    } catch (err) {
      setError("Failed to fetch Reddit profile.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [profile]);

  const handleRefresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    fetchProfile();
  };

  if (loading)
    return <div className="text-center text-sm text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center text-sm text-red-500 mt-4">{error}</div>;

  const {
    name,
    total_karma,
    comment_karma,
    link_karma,
    created_utc,
    verified,
    snoovatar_img,
  } = profile;

  const accountCreationDate = new Date(created_utc * 1000).toLocaleDateString();

  return (
    <div
      ref={containerRef}
      className="mt-6 p-6 bg-gray-50 rounded-xl shadow-inner border space-y-4 w-5/6 mx-auto"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {snoovatar_img && (
            <img
              src={snoovatar_img}
              alt="Snoovatar"
              className="w-20 h-20 rounded-full border-2 border-orange-500"
            />
          )}
          <div>
            <div className="text-xl font-bold text-gray-800">
              @{name}
              {verified && (
                <FaCheckCircle
                  className="text-green-500 inline ml-2"
                  title="Verified"
                />
              )}
            </div>
            <div className="text-gray-600">{name}</div>
            <p className="text-sm text-gray-500 mt-1">
              {profile.biography || "No biography available."}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
          title="Refresh"
        >
          <FaSyncAlt />
        </button>
      </div>

      <div className="flex justify-around mt-4 text-center text-sm text-gray-700 font-medium">
        <div className="flex items-center gap-1">
          <FaUserFriends className="text-blue-500" />
          Karma: {total_karma}
        </div>
        <div className="flex items-center gap-1">
          <FaImages className="text-purple-500" />
          Comments: {comment_karma}
        </div>
        <div className="flex items-center gap-1">
          <FaUser className="text-green-500" />
          Posts: {link_karma}
        </div>
      </div>

      {/* Reddit Feed */}
      <div className="mt-8">
        <RedditFeed />
      </div>

      {/* View Profile Button */}
      <div className="mt-8 text-center">
        <button
          className="px-8 py-3 bg-orange-500 text-white rounded-full flex items-center justify-center gap-3 mx-auto shadow-lg hover:bg-orange-600 transition"
          onClick={() =>
            window.open(`https://www.reddit.com/user/${name}`, "_blank")
          }
        >
          <FaReddit /> View Reddit Profile
        </button>
      </div>
    </div>
  );
};

export default RedditProfile;
