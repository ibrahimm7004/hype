import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TwitterCreatePost = ({ initialText = "", initialImage = "" }) => {
  const [tweetText, setTweetText] = useState(initialText);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [charCount, setCharCount] = useState(initialText.length);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [schedule, setSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());

  const MAX_CHAR_COUNT = 280;

  const fetchImageFromUrl = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "tweet-image.jpg", { type: blob.type });
      setImage(URL.createObjectURL(blob));
      setImageFile(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
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
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handlePostTweet = async () => {
    if (tweetText.length > MAX_CHAR_COUNT || tweetText.length === 0) {
      alert("Please write a valid tweet");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("tweet_text", tweetText);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (schedule) {
        formData.append("schedule", true);
        formData.append("scheduled_time", scheduledTime.toISOString());
      }

      const response = await fetchData(`/twitter/tweet`, "POST", formData);

      if (response && response.status === 200) {
        alert(schedule ? "Tweet scheduled!" : "Tweet posted!");
        setTweetText("");
        setCharCount(0);
        setImage(null);
        setImageFile(null);
        setSchedule(false);
      } else {
        alert("Failed to post tweet");
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("An error occurred while posting the tweet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-16 pb-20 flex"
      >
        {/* Left - Info */}
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
        </div>

        {/* Right - Form */}
        <div className="w-2/3 p-6">
          <motion.textarea
            value={tweetText}
            onChange={handleTweetChange}
            placeholder="What's on your mind?"
            className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="cursor-pointer text-blue-500"
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
            </div>
          </div>

          {/* ✅ Scheduling Option */}
          <div className="mt-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={schedule}
                onChange={(e) => setSchedule(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Schedule this tweet</span>
            </label>

            {schedule && (
              <div className="pt-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Select Date & Time
                </label>
                <DatePicker
                  selected={scheduledTime}
                  onChange={(date) => setScheduledTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="border px-3 py-2 rounded-md w-full"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-x-4">
            <motion.button
              onClick={handlePostTweet}
              disabled={
                tweetText.length === 0 || charCount > MAX_CHAR_COUNT || loading
              }
              className={`px-6 py-1 rounded-full text-white font-semibold transition-all ${
                tweetText.length > 0 && charCount <= MAX_CHAR_COUNT && !loading
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {loading
                ? schedule
                  ? "Scheduling..."
                  : "Posting..."
                : schedule
                ? "Schedule Tweet"
                : "Tweet"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TwitterCreatePost;
