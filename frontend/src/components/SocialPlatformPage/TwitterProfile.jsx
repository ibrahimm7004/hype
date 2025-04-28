import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import fetchData from "../../utils/fetchData";

const TwitterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = localStorage.getItem("twitter_profile");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          setLoading(false);
          return;
        }

        const profileData = await fetchData(`/twitter/profile`, "GET");

        if (profileData?.data?.user) {
          setProfile(profileData.data.user);
          localStorage.setItem(
            "twitter_profile",
            JSON.stringify(profileData.data.user)
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

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      // gsap.fromTo(
      //   ".profile-header",
      //   { opacity: 0, x: -100 },
      //   { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      // );
      // gsap.fromTo(
      //   ".bio-section",
      //   { opacity: 0, x: 100 },
      //   { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      // );
      // gsap.fromTo(
      //   ".stats-section",
      //   { opacity: 0, y: 50 },
      //   { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      // );
    }
  }, [profile]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      ref={containerRef}
      className="w-full max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 profile-container"
    >
      {/* Profile Header */}
      <div className="flex items-center space-x-4 profile-header">
        <img
          src={profile.profile_image_url_https}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-blue-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.name}
          </h2>
          <p className="text-gray-500 text-sm">@{profile.screen_name}</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-4 text-gray-700 bio-section">
        <p>{profile.description || "No bio available"}</p>
      </div>

      {/* Stats Section */}
      <div className="mt-6 flex justify-between text-gray-600 stats-section">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{profile.followers_count}</span>{" "}
          Followers
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{profile.friends_count}</span>{" "}
          Following
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{profile.statuses_count}</span> Tweets
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 text-gray-600">
        <p>📅 Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
        <p>📍 Location: {profile.location || "Not specified"}</p>
        <p>🔒 Account: {profile.protected ? "Private" : "Public"}</p>
        <p>📌 Geo-Enabled: {profile.geo_enabled ? "Yes" : "No"}</p>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          className="bg-blue-400 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:bg-blue-600 transition transform hover:scale-105 duration-300"
          onClick={() => {
            window.location.reload();
            localStorage.removeItem("twitter_profile");
          }}
        >
          Refresh Profile
        </button>
      </div>

      {/* Last Tweet with Media (if available) */}
      {profile.status &&
        profile.status.extended_entities?.media?.length > 0 && (
          <motion.div className="mt-6 bg-white shadow-lg rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">Latest Tweet</h3>
            <p className="text-gray-700">{profile.status.text}</p>
            <img
              src={profile.status.extended_entities.media[0].media_url_https}
              alt="Tweet Media"
              className="mt-4 w-full rounded-xl"
            />
          </motion.div>
        )}
    </motion.div>
  );
};

export default TwitterProfile;
