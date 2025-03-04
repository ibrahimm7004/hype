import React, { useState, useEffect } from "react";
import twitterCallback from "../../utils/twitterCallback";
import fetchData from "../../utils/fetchData";

const TwitterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-1/2 mx-auto justify-center items-center gap-x-4">
      <div className="  mt-10 bg-white shadow-lg rounded-lg p-6">
        {/* Profile Header */}

        <div className="flex items-center space-x-4">
          <img
            src={profile.profile_image_url_https}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-500"
          />
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">@{profile.screen_name}</p>
          </div>
        </div>

        {/* Bio Section */}
        <p className="mt-4 text-gray-700">
          {profile.description || "No bio available"}
        </p>

        {/* Stats Section */}
        <div className="mt-4 flex justify-between text-gray-600">
          <p>
            <span className="font-bold">{profile.followers_count}</span>{" "}
            Followers
          </p>
          <p>
            <span className="font-bold">{profile.friends_count}</span> Following
          </p>
          <p>
            <span className="font-bold">{profile.statuses_count}</span> Tweets
          </p>
        </div>

        {/* Additional Details */}
        <div className="mt-4 text-gray-600">
          <p>📅 Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
          <p>📍 Location: {profile.location || "Not specified"}</p>
          <p>🔒 Account: {profile.protected ? "Private" : "Public"}</p>
          <p>📌 Geo-Enabled: {profile.geo_enabled ? "Yes" : "No"}</p>
        </div>
        <button
          className="bg-blue-400 rounded-full px-6 shadow-lg py-1 font-semibold text-white mt-4 hover:bg-blue-600 hover:-translate-y-1 transition duration-300"
          onClick={() => {
            window.location.reload();
            localStorage.removeItem("twitter_profile");
          }}
        >
          Refresh
        </button>
      </div>
      {/* Last Tweet with Media (if available) */}
      {profile.status &&
        profile.status.extended_entities?.media?.length > 0 && (
          <div className="mt-6 border-t pt-4 bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">Latest Tweet</h3>
            <p className="text-gray-700 w-2/3 ">{profile.status.text}</p>
            <img
              src={profile.status.extended_entities.media[0].media_url_https}
              alt="Tweet Media"
              className="mt-2 w-[200px] rounded-lg"
            />
          </div>
        )}
    </div>
  );
};

export default TwitterProfile;
