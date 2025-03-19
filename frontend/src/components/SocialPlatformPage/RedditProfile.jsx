import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaReddit, FaUser, FaCalendar, FaCheckCircle } from "react-icons/fa";
import fetchData from "../../utils/fetchData";
import RedditFeed from "./RedditFeed";

const RedditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function extractUserPosts(rawData) {
    rawData.forEach((element) => {
      console.log(element.data);
    });
    return rawData.map((post) => ({
      id: post.id,
      title: post.title,
      author: post.author,
      created_utc: post.created_utc,
      num_comments: post.num_comments,
      score: post.score,
      thumbnail: post.thumbnail,
      url: post.url,
    }));
  }

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const user_id = localStorage.getItem("user_id");
      const storedProfile = localStorage.getItem("reddit_profile");

      // let posts = localStorage.getItem("posts");
      // posts = JSON.parse(posts);

      // console.log(posts.children);

      // const clean = extractUserPosts(posts.children);

      // console.log(clean);

      // console.log("posts", posts);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setLoading(false);
        return;
      }

      const profileData = await fetchData(
        `/reddit/profile?user_id=${user_id}`,
        "GET"
      );

      // console.log("Profile Data:", profileData);
      // console.log("user posts:", userPosts.data.data.children);

      // const cleanData = extractUserPosts(userPosts.data.data.children);
      // console.log(cleanData);

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
      setError("Failed to fetch Twitter profile.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleViewProfile = () => {
    window.open("https://www.reddit.com/user/" + profile.name, "_blank");
  };

  if (!profile) {
    return <div className="text-center p-6 text-gray-500">Loading...</div>;
  }

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-1/2 mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-center space-x-4">
        <img
          src={snoovatar_img}
          alt="Reddit Avatar"
          className="w-20 h-20 rounded-full border-2 border-orange-500"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <FaUser className="text-orange-500" />
            <span>{name}</span>
            {verified && (
              <FaCheckCircle className="text-green-500" title="Verified" />
            )}
          </h2>
          <p className="text-gray-600 flex items-center">
            <FaCalendar className="mr-2" /> Joined: {accountCreationDate}
          </p>

          <button
            className="px-4 py-1 text-white bg-orange-500 rounded-full mt-2 text-xs hover:bg-orange-600 transition"
            onClick={() => {
              localStorage.removeItem("reddit_profile");
              fetchProfile();
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-700">{total_karma}</p>
          <p className="text-gray-500 text-sm">Total Karma</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">{comment_karma}</p>
          <p className="text-gray-500 text-sm">Comment Karma</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">{link_karma}</p>
          <p className="text-gray-500 text-sm">Post Karma</p>
        </div>
      </div>

      {subreddit && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Subreddit Info
          </h3>
          <p className="text-gray-600">{subreddit.display_name_prefixed}</p>
          <p className="text-gray-500 text-sm">
            Subscribers: {subreddit.subscribers}
          </p>
        </div>
      )}

      <RedditFeed />

      <div className="mt-4 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center space-x-2 mx-auto"
          onClick={handleViewProfile}
        >
          <FaReddit /> <span>View Reddit Profile</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RedditProfile;
