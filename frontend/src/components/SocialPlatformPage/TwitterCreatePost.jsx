import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import twitterCallback from "../../utils/twitterCallback";
import fetchData from "../../utils/fetchData";

const TwitterCreatePost = ({ initialText = "", initialImage = "" }) => {
  const [tweetText, setTweetText] = useState(initialText);
  const [image, setImage] = useState(null); // Stores the image preview (URL)
  const [imageFile, setImageFile] = useState(null); // Stores the actual image file
  const [charCount, setCharCount] = useState(initialText.length);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_CHAR_COUNT = 280;

  // Function to fetch image from URL and convert it to a File object
  const fetchImageFromUrl = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob(); // Convert to binary blob
      const file = new File([blob], "tweet-image.jpg", { type: blob.type }); // Create File object
      setImage(URL.createObjectURL(blob)); // Preview Image
      setImageFile(file); // Store File
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Fetch image if initialImage is a URL
  useEffect(() => {
    console.log("Initial Image:", initialImage);
    if (initialImage && initialImage.startsWith("http")) {
      fetchImageFromUrl(initialImage);
    }
  }, [initialImage]);

  const handleTweetChange = (e) => {
    const text = e.target.value;
    setTweetText(text);
    setCharCount(text.length);
    setErrorMessage(
      text.length > MAX_CHAR_COUNT ? "Tweet exceeds character limit" : ""
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview new image
      setImageFile(file); // Store new file
    }
  };

  const handleScheduleTweet = async () => {
    if (tweetText.length <= MAX_CHAR_COUNT && tweetText.length > 0) {
      setLoading(true);

      let hasText = Boolean(tweetText.trim());
      let hasImage = Boolean(imageFile);

      if (hasImage) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
          const imageBase64 = reader.result; // Convert image to Base64
          localStorage.setItem("scheduled_tweet_image", imageBase64);
          localStorage.setItem("scheduled_tweet_text", tweetText);

          // Redirect with flags only
          window.location.href = `/social-platform/twitter/schedule-post?has_text=${hasText}&has_image=${hasImage}`;
        };
      } else {
        localStorage.setItem("scheduled_tweet_text", tweetText);
        localStorage.removeItem("scheduled_tweet_image"); // Remove old image if none is uploaded

        // Redirect with flags only
        window.location.href = `/social-platform/twitter/schedule-post?has_text=${hasText}&has_image=${hasImage}`;
      }

      setLoading(false);
    } else {
      alert("Please write a valid tweet");
    }
  };

  const handlePostTweet = async () => {
    if (tweetText.length <= MAX_CHAR_COUNT && tweetText.length > 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("tweet_text", tweetText);
        if (imageFile) {
          formData.append("image", imageFile); // Upload the file (either from URL or user upload)
        }

        // const oauthToken = localStorage.getItem("oauth_token");
        const response = await fetchData(`/twitter/tweet`, "POST", formData);

        if (response && response.status === 200) {
          alert("Tweet posted successfully!");
          setTweetText("");
          setCharCount(0);
          setImage(null);
          setImageFile(null);
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
    <div className="flex items-center justify-center bg-gray-100 mt-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-16 pb-20  flex"
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

          <div className="mt-6 flex justify-end gap-x-4">
            <motion.button
              onClick={handleScheduleTweet}
              disabled={
                tweetText.length === 0 ||
                tweetText.length > MAX_CHAR_COUNT ||
                loading
              }
              className={`px-6 py-1 rounded-full font-semibold transition-all border-[1px] bg-white
                  ${
                    tweetText.length > 0 &&
                    tweetText.length <= MAX_CHAR_COUNT &&
                    !loading
                      ? "border-black hover:text-white hover:bg-black"
                      : "text-gray-400 border-gray-400 cursor-not-allowed"
                  }`}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Scheduling..." : "Schedule"}
            </motion.button>
            <motion.button
              onClick={handlePostTweet}
              disabled={
                tweetText.length === 0 ||
                tweetText.length > MAX_CHAR_COUNT ||
                loading
              }
              className={`px-6 py-1 rounded-full text-white font-semibold transition-all
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
