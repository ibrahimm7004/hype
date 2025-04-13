import React, { useEffect, useState, useRef } from "react";
import { FaTwitter, FaInstagram, FaReddit, FaFacebook } from "react-icons/fa";
import fetchData from "../utils/fetchData";
import { gsap } from "gsap";

const SocialMediaAuthPage = () => {
  const [authenticatedPlatforms, setAuthenticatedPlatforms] = useState({});
  const cardRef = useRef(null);
  const buttonsRef = useRef([]);

  useEffect(() => {
    setAuthenticatedPlatforms({
      twitter: !!localStorage.getItem("twitter_jwt_token"),
      instagram: !!localStorage.getItem("instagram_jwt_token"),
      reddit: !!localStorage.getItem("reddit_jwt_token"),
      facebook: !!localStorage.getItem("facebook_jwt_token"),
    });

    gsap.from(cardRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(buttonsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.3,
      stagger: 0.15,
      ease: "power2.out",
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
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        window.location.href = "/user/login";
        alert("Please login first");
        return;
      }

      const response = await fetchData(
        `/${platform.id}/login`,
        "POST",
        JSON.stringify({ user_id })
      );

      console.log(`Response login Platform ${platform.id}:`, response);
      window.location.href = response.data.auth_url;
    } catch (err) {
      console.log("Error logging in:", err);
    }
  };

  const handleRevoke = (platformId) => {
    localStorage.removeItem(`${platformId}_jwt_token`);
    localStorage.removeItem("oauth_token");
    setAuthenticatedPlatforms((prev) => ({
      ...prev,
      [platformId]: false,
    }));
  };

  return (
    <div className="mt-12 flex flex-col items-center justify-center bg-gray-100 py-20 p-6">
      <div
        ref={cardRef}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Authenticate Your Social Media
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Connect your accounts for login and sharing capabilities.
        </p>

        <div className="space-y-4 w-full">
          {platforms.map((platform, index) => (
            <div
              key={platform.id}
              ref={(el) => (buttonsRef.current[index] = el)}
              className="flex justify-between items-center"
            >
              <button
                onClick={() => handleAuth(platform)}
                className={`flex items-center justify-center w-full font-medium py-3 rounded-lg shadow-lg hover:scale-[1.03] transition-transform text-white`}
                style={{ backgroundColor: platform.color }}
              >
                {platform.icon}
                <span className="ml-2 text-sm">
                  {authenticatedPlatforms[platform.id]
                    ? "Authenticated ✅"
                    : `Authenticate with ${platform.name}`}
                </span>
              </button>
              {authenticatedPlatforms[platform.id] && (
                <button
                  onClick={() => handleRevoke(platform.id)}
                  className="ml-3 px-3 py-1 bg-red-600 text-white text-xs rounded shadow hover:bg-red-700 transition"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAuthPage;
