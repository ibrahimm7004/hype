import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";
import {
  faClock,
  faRotateRight,
  faCommentDots,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import ImageCarousel from "./ImageCarousel";
import TwitterCreatePost from "../SocialPlatformPage/TwitterCreatePost";
import FacebookCreatePost from "../meta/facebook/FacebookCreatePost";
import InstagramCreatePost from "../meta/instagram/InstagramCreatePost";
import RedditCreatePost from "../SocialPlatformPage/RedditCreatePost";

const platformComponents = {
  twitter: TwitterCreatePost,
  facebook: FacebookCreatePost,
  instagram: InstagramCreatePost,
  reddit: RedditCreatePost,
};

const ImageGallery = ({ imageUrls, setInterfaceState }) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls?.[0]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const optionsRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (optionsRef.current) {
      gsap.from(optionsRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    if (carouselRef.current) {
      gsap.from(carouselRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, [selectedPlatform]);

  if (!imageUrls || imageUrls.length === 0) {
    return <p className="text-center text-gray-400">No images available</p>;
  }

  const postOptions = [
    {
      label: "Post to Twitter",
      platform: "twitter",
      description: "Post this image directly to your Twitter account.",
      icon: faTwitter,
      color: "#1DA1F2",
    },
    {
      label: "Post to Facebook",
      platform: "facebook",
      description: "Share this image with your Facebook audience.",
      icon: faFacebook,
      color: "#1877F2",
    },
    {
      label: "Post to Instagram",
      platform: "instagram",
      description: "Post this image to your Instagram feed.",
      icon: faInstagram,
      color: "#C13584",
    },
    {
      label: "Post to Reddit",
      platform: "reddit",
      description: "Post this image to your favorite subreddit.",
      icon: faReddit,
      color: "#FF4500",
    },
    {
      label: "Re-Enter Prompt",
      description: "Generate a new image by re-entering a prompt.",
      icon: faRotateRight,
      color: "#10B981", // emerald green
      action: () => setInterfaceState("textPrompt"),
    },
  ];

  const handleOptionClick = (option) => {
    if (option.platform) {
      setSelectedPlatform(option.platform);
    } else if (option.action) {
      option.action();
    }
  };

  const SelectedPostComponent = selectedPlatform
    ? platformComponents[selectedPlatform]
    : null;

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen p-8">
      <div className="flex flex-col md:flex-row w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-8">
        {/* Options Panel */}
        {!selectedPlatform && (
          <div className="flex flex-col w-full space-y-5" ref={optionsRef}>
            {postOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                <div className="mr-4 text-xl" style={{ color: option.color }}>
                  <FontAwesomeIcon icon={option.icon} />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{option.label}</p>
                  <p className="text-gray-500 text-sm">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Platform Post UI */}
        {selectedPlatform && SelectedPostComponent && (
          <div className="flex flex-col w-full space-y-6" ref={optionsRef}>
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              onClick={() => setSelectedPlatform(null)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <SelectedPostComponent initialImage={selectedImage} />
          </div>
        )}

        {/* Image Carousel */}
        <div className="w-full md:w-2/3" ref={carouselRef}>
          <ImageCarousel
            imageUrls={imageUrls}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
