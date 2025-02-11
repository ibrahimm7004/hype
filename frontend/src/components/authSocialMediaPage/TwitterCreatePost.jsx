import React, { useState } from "react";
import { motion } from "framer-motion";
import twitterCallback from "../../utils/twitterCallback";

const TwitterCreatePost = () => {
  const [tweetText, setTweetText] = useState("");
  const [image, setImage] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_CHAR_COUNT = 280;

  const handleTweetChange = (e) => {
    const text = e.target.value;
    setTweetText(text);
    setCharCount(text.length);
    if (text.length > MAX_CHAR_COUNT) {
      setErrorMessage("Tweet exceeds character limit");
    } else {
      setErrorMessage("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePostTweet = async () => {
    if (tweetText.length <= MAX_CHAR_COUNT && tweetText.length > 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("tweet_text", tweetText);
        if (image) {
          const imageFile = document.getElementById("image-upload").files[0];
          formData.append("image", imageFile);
        }

        const oauthToken = localStorage.getItem("oauth_token");
        const response = await twitterCallback(
          `/twitter/tweet?oauth_token=${oauthToken}`,
          "POST",
          formData
        );

        if (response && response.status === 200) {
          alert("Tweet posted successfully!");
          setTweetText("");
          setCharCount(0);
          setImage(null);
        } else {
          alert("Failed to post tweet");
        }
      } catch (error) {
        console.error("Error posting tweet:", error);
        alert("An error occurred while posting the tweet.");
      }
      setLoading(false);
    } else {
      alert("Please write a valid tweet");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100   mt-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-16 pb-20 w-1/2 flex"
      >
        {/* Left Side - Info Section */}
        <div className="w-1/3 p-4 flex flex-col justify-center items-center border-r">
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tweet Something! 🐦
          </motion.h2>
          <p className="text-gray-600 text-sm text-center">
            Share your thoughts, photos, and updates with the world instantly.
          </p>
          <motion.img
            src="https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
            alt="Twitter Logo"
            className="w-20 h-20 mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>

        {/* Right Side - Tweet Form */}
        <div className="w-2/3 p-6">
          <motion.textarea
            value={tweetText}
            onChange={handleTweetChange}
            name="tweet"
            placeholder="What's on your mind?"
            className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            maxLength={MAX_CHAR_COUNT}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          />

          {image && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={image}
                alt="Tweet attachment"
                className="max-w-full rounded-md"
              />
            </motion.div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-blue-500 hover:text-blue-600 transition"
            >
              📷 Add Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />

            <div className="flex items-center space-x-2">
              <span
                className={
                  charCount > MAX_CHAR_COUNT ? "text-red-500" : "text-gray-500"
                }
              >
                {charCount}/{MAX_CHAR_COUNT}
              </span>
              {errorMessage && (
                <span className="text-red-500 text-xs">{errorMessage}</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={handlePostTweet}
              disabled={
                tweetText.length === 0 ||
                tweetText.length > MAX_CHAR_COUNT ||
                loading
              }
              className={`px-6 py-2 rounded-full text-white font-semibold transition-all
                ${
                  tweetText.length > 0 &&
                  tweetText.length <= MAX_CHAR_COUNT &&
                  !loading
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Posting..." : "Tweet"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TwitterCreatePost;
