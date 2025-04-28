import React, { useState, useEffect, useRef } from "react";
import RedditCreatePost from "./RedditCreatePost";
import TwitterCreatePost from "./TwitterCreatePost";
import FacebookCreatePost from "../meta/facebook/FacebookCreatePost";
import InstagramCreatePost from "../meta/instagram/InstagramCreatePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReddit,
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { gsap } from "gsap";
import clsx from "clsx"; // (npm install clsx)

const platforms = [
  {
    key: "reddit",
    name: "Reddit",
    icon: faReddit,
    color: "bg-orange-500",
    textColor: "text-orange-500",
    component: <RedditCreatePost />,
  },
  {
    key: "twitter",
    name: "Twitter",
    icon: faTwitter,
    color: "bg-blue-400",
    textColor: "text-blue-400",
    component: <TwitterCreatePost />,
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: faFacebook,
    color: "bg-blue-600",
    textColor: "text-blue-600",
    component: <FacebookCreatePost />,
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: faInstagram,
    color: "bg-pink-500",
    textColor: "text-pink-500",
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
    <div className="w-full  bg-gradient-to-br from-pink-50 via-blue-50 to-white p-8 md:p-12 rounded-md">
      {/* <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
        Create a Post ✍️
      </h1> */}

      {/* Platform Toggle */}
      <div
        ref={toggleRef}
        className="flex justify-center flex-wrap gap-4 mb-12 mx-auto"
      >
        {platforms.map((p) => (
          <button
            key={p.key}
            onClick={() => setPlatform(p.key)}
            className={clsx(
              "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm",
              platform === p.key
                ? `${p.color} text-white shadow-md scale-105`
                : `bg-white ${p.textColor} border border-gray-300 hover:bg-gray-100`
            )}
          >
            <FontAwesomeIcon icon={p.icon} />
            {p.name}
          </button>
        ))}
      </div>

      {/* Form Section */}

      {selected ? selected.component : null}
    </div>
  );
};

export default CreatePost;
