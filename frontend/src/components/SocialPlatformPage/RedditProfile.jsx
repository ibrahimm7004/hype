import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaReddit,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaSyncAlt,
} from "react-icons/fa";
import fetchData from "../../utils/fetchData";
import RedditFeed from "./RedditFeed";

const RedditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const user_id = localStorage.getItem("user_id");
      const storedProfile = localStorage.getItem("reddit_profile");

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
        localStorage.setItem(
          "reddit_profile",
          JSON.stringify(profileData.data)
        );
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

  const handleRefresh = () => {
    localStorage.removeItem("reddit_profile");
    fetchProfile();
  };

  const handleViewProfile = () => {
    if (profile?.name) {
      window.open(`https://www.reddit.com/user/${profile.name}`, "_blank");
    }
  };

  if (loading)
    return (
      <div className="text-center p-8 text-gray-500">Loading profile...</div>
    );

  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  if (!profile) return null;

  const {
    name,
    total_karma,
    comment_karma,
    link_karma,
    created_utc,
    verified,
    snoovatar_img,
    subreddit,
  } = profile;

  const accountCreationDate = new Date(created_utc * 1000).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200"
    >
      <div className="flex items-center space-x-6">
        {snoovatar_img && (
          <img
            src={snoovatar_img}
            alt="Snoovatar"
            className="w-20 h-20 rounded-full border-2 border-orange-500"
          />
        )}
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
            <FaUser className="text-orange-500" />
            {name}
            {verified && (
              <FaCheckCircle className="text-green-500" title="Verified" />
            )}
          </div>
          <p className="text-gray-500 flex items-center mt-1">
            <FaCalendar className="mr-2" /> Joined: {accountCreationDate}
          </p>

          <button
            onClick={handleRefresh}
            className="mt-3 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full flex items-center gap-1 transition"
          >
            <FaSyncAlt className="text-gray-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Karma Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-xl font-bold text-orange-600">{total_karma}</p>
          <p className="text-sm text-gray-500">Total Karma</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-xl font-bold text-blue-600">{comment_karma}</p>
          <p className="text-sm text-gray-500">Comment Karma</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-xl font-bold text-purple-600">{link_karma}</p>
          <p className="text-sm text-gray-500">Post Karma</p>
        </div>
      </div>

      {/* Subreddit Info */}
      {subreddit && (
        <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center shadow-inner">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            Subreddit Info
          </h3>
          <p className="text-gray-700 font-medium">
            {subreddit.display_name_prefixed}
          </p>
          <p className="text-sm text-gray-500">
            Subscribers: {subreddit.subscribers}
          </p>
        </div>
      )}

      {/* Feed */}
      <div className="mt-8">
        <RedditFeed />
      </div>

      {/* View Profile Button */}
      <div className="mt-6 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2 mx-auto shadow hover:bg-orange-600 transition"
          onClick={handleViewProfile}
        >
          <FaReddit /> View Reddit Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RedditProfile;
