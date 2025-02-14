import React, { useEffect, useState } from "react";
import { FaTwitter, FaInstagram, FaReddit, FaFacebook } from "react-icons/fa";
import fetchData from "../utils/fetchData";

const SocialMediaAuthPage = () => {
  const [authenticatedPlatforms, setAuthenticatedPlatforms] = useState({});

  useEffect(() => {
    // Check which platforms have tokens stored
    setAuthenticatedPlatforms({
      twitter: !!localStorage.getItem("twitter_jwt_token"),
      instagram: !!localStorage.getItem("instagram_jwt_token"),
      reddit: !!localStorage.getItem("reddit_jwt_token"),
      facebook: !!localStorage.getItem("facebook_jwt_token"),
    });
  }, []);

  const platforms = [
    {
      id: "twitter",
      name: "Twitter",
      color: "#1DA1F2",
      icon: <FaTwitter size={20} />,
    },
    {
      id: "instagram",
      name: "Instagram",
      color: "#E4405F",
      icon: <FaInstagram size={20} />,
    },
    {
      id: "reddit",
      name: "Reddit",
      color: "#FF5700",
      icon: <FaReddit size={20} />,
    },
    {
      id: "facebook",
      name: "Facebook",
      color: "#1877F2",
      icon: <FaFacebook size={20} />,
    },
  ];

  const handleAuth = async (platform) => {
    try {
      const response = await fetchData(`/${platform.id}/login`, "GET");
      console.log(`Response login Platform ${platform.id}:`, response);

      // Save the token in local storage
      localStorage.setItem(
        `${platform.id}_jwt_token`,
        response.data.twitter_token
      );
      localStorage.setItem("oauth_token", response.data.oauth_token);

      // Redirect to authentication URL
      window.location.href = response.data.auth_url;
    } catch (err) {
      console.log("Error logging in:", err);
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Authenticate Your Social Media
        </h1>
        <p className="text-gray-600 mt-2">
          Connect your social media accounts to enable seamless login and data
          sharing.
        </p>

        <div className="mt-6 space-y-4 w-full">
          {platforms.map((platform) => (
            <div>
              <button
                key={platform.id}
                onClick={() => handleAuth(platform)}
                disabled={authenticatedPlatforms[platform.id]} // Disable if already authenticated
                className={`
                flex items-center justify-center w-full text-white font-medium py-3 rounded-lg shadow-md transition-transform transform hover:scale-105
                ${
                  authenticatedPlatforms[platform.id]
                    ? "opacity-50 cursor-not-allowed border-4 border-slate-800"
                    : ""
                }
                    `}
                style={{ backgroundColor: platform.color }}
              >
                {platform.icon}
                <span className="ml-2">
                  {authenticatedPlatforms[platform.id]
                    ? "Authenticated ✅"
                    : `Authenticate with ${platform.name}`}
                </span>
              </button>
              {platform.id === "twitter" && (
                <p className="mt-10 font-medium text-slate-600 ">
                  --- Coming soon! ---
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAuthPage;
