import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Facebook,
  Instagram,
  // Reddit,
  Clock,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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

  if (!imageUrls || imageUrls.length === 0) {
    return <p className="text-center text-gray-500">No images available</p>;
  }

  useEffect(() => {
    console.log("Selected Image:", selectedImage);
  }, [selectedImage]);

  const postOptions = [
    {
      label: "Post to Twitter",
      platform: "twitter",
      description: "Post this image directly to your Twitter account.",
      icon: <Twitter className="w-6 h-6 text-[#1DA1F2]" />,
    },
    {
      label: "Post to Facebook",
      platform: "facebook",
      description: "Share this image with your Facebook audience.",
      icon: <Facebook className="w-6 h-6 text-[#1877F2]" />,
    },
    {
      label: "Post to Instagram",
      platform: "instagram",
      description: "Post this image to your Instagram feed.",
      icon: <Instagram className="w-6 h-6 text-[#C13584]" />,
    },
    {
      label: "Post to Reddit",
      platform: "reddit",
      description: "Post this image to your favorite subreddit.",
      // icon: <Reddit className="w-6 h-6 text-[#FF4500]" />,
      icon: <Clock className="w-6 h-6 text-gray-500" />,
    },

    {
      label: "Re-Enter Prompt",
      description: "Generate a new image by re-entering a prompt.",
      icon: <RefreshCcw className="w-6 h-6 text-green-500" />,
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
    <div className="flex flex-col items-center bg-white p-6">
      <div className="flex flex-col md:flex-row w-full bg-green-500 space-y-6 md:space-y-0 md:space-x-8">
        {/* Options Panel */}
        {!selectedPlatform && (
          <motion.div
            className="flex flex-col w-full space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {postOptions.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-6 bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg transition-all border-l-4 border-indigo-500 w-full"
                onClick={() => handleOptionClick(option)}
              >
                <div className="mr-4">{option.icon}</div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="font-light w-3/4 text-sm">
                    {option.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Selected Platform Post UI */}
        {selectedPlatform && SelectedPostComponent && (
          <div className="flex flex-col space-y-4 w-full">
            <button
              className="self-start bg-gray-800 text-white rounded-md px-4 py-2 mb-4"
              onClick={() => setSelectedPlatform(null)}
            >
              ← Back
            </button>
            <SelectedPostComponent initialImage={selectedImage} />
          </div>
        )}

        {/* Image Carousel */}
        <motion.div
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageCarousel
            imageUrls={imageUrls}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ImageGallery;
