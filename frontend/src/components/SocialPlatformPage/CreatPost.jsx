import React, { useState, useEffect, useRef } from "react";
import RedditCreatePost from "./RedditCreatePost";
import TwitterCreatePost from "./TwitterCreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReddit,
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { gsap } from "gsap";
import FacebookCreatePost from "../meta/facebook/FacebookCreatePost";
import InstagramCreatePost from "../meta/instagram/InstagramCreatePost";

const platforms = [
  {
    key: "reddit",
    name: "Reddit",
    icon: faReddit,
    color: "orange-500",
    component: <RedditCreatePost />,
  },
  {
    key: "twitter",
    name: "Twitter",
    icon: faTwitter,
    color: "blue-500",
    component: <TwitterCreatePost />,
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: faFacebook,
    color: "blue-600",
    component: <FacebookCreatePost />,
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: faInstagram,
    color: "pink-600",
    component: <InstagramCreatePost />,
  },
];

const CreatePost = () => {
  const [platform, setPlatform] = useState("reddit");
  const formRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    gsap.from(toggleRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [platform]);

  const selected = platforms.find((p) => p.key === platform);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Create a Post
      </h1>

      {/* Platform Toggle */}
      <div
        ref={toggleRef}
        className="flex justify-center flex-wrap bg-gray-100 rounded-full p-3 mb-8 gap-4 shadow-inner"
      >
        {platforms.map((p) => (
          <button
            key={p.key}
            onClick={() => setPlatform(p.key)}
            className={`flex items-center px-5 py-2 rounded-full transition duration-300 font-medium 
              ${
                platform === p.key
                  ? `bg-${p.color} text-white shadow-lg`
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
          >
            <FontAwesomeIcon icon={p.icon} className="mr-2" />
            {p.name}
          </button>
        ))}
      </div>

      {/* Form Section */}
      <div ref={formRef}>{selected ? selected.component : null}</div>
    </div>
  );
};

export default CreatePost;
