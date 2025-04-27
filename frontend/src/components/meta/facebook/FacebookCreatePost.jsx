import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import fetchData from "../../../utils/fetchData";
import DateTimePicker from "../../utils/DateTimePicker";

const FacebookCreatePost = ({ initialText = "", initialImage = "" }) => {
  const [postText, setPostText] = useState(initialText);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [charCount, setCharCount] = useState(initialText.length);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());

  const MAX_CHAR_COUNT = 5000;
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
  const handleTextChange = (e) => {
    const text = e.target.value;
    setPostText(text);
    setCharCount(text.length);
    setErrorMessage(
      text.length > MAX_CHAR_COUNT ? "Post exceeds character limit" : ""
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
      setImageUrl("");
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  const handlePost = async () => {
    if (postText.length === 0 && !imageFile && !imageUrl) {
      alert("Post must have text, image URL, or an uploaded image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("post_text", postText);
      if (imageFile) formData.append("image_file", imageFile);
      if (imageUrl) formData.append("image_url", imageUrl);

      formData.append("post_type", isScheduled ? "scheduled" : "instant");
      if (isScheduled && scheduledTime) {
        formData.append("scheduled_time", scheduledTime.toISOString());
      }

      const response = await fetchData("/meta/facebook/post", "POST", formData);

      if (response && response.status === 200) {
        alert(
          isScheduled
            ? "Post scheduled successfully!"
            : "Post shared successfully!"
        );
        setPostText("");
        setCharCount(0);
        setImagePreview("");
        setImageFile(null);
        setImageUrl("");
        setIsScheduled(false);
        setScheduledTime(new Date());
      } else {
        alert("Failed to post to Facebook.");
      }
    } catch (error) {
      console.error("Error posting:", error);
      alert("An error occurred while posting.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-10 text-gray-700">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-16 pb-20 flex"
      >
        {/* Left Panel */}
        <div className="w-1/3 p-4 flex flex-col items-center border-r text-center">
          <motion.h2
            className="text-2xl font-bold text-blue-800 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share on Facebook 📘
          </motion.h2>
          <p className="text-gray-600 text-sm">
            Post updates, photos, or thoughts with your Facebook audience.
          </p>
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
            alt="Facebook"
            className="w-20 h-20 mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>

        {/* Right Form */}
        <div className="w-2/3 p-6">
          <motion.textarea
            value={postText}
            onChange={handleTextChange}
            placeholder="What's on your mind?"
            className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={MAX_CHAR_COUNT}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          />

          {imagePreview && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full rounded-md"
              />
            </motion.div>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="fb-image-upload"
                className="cursor-pointer text-blue-600 hover:underline"
              >
                📷 Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                id="fb-image-upload"
                onChange={handleImageChange}
                className="hidden"
              />
              <span
                className={
                  charCount > MAX_CHAR_COUNT ? "text-red-500" : "text-gray-500"
                }
              >
                {charCount}/{MAX_CHAR_COUNT}
              </span>
            </div>

            <input
              type="text"
              placeholder="...or paste image URL"
              value={imageUrl}
              onChange={handleUrlChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scheduling Toggle */}
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium">
              ⏰ Schedule this post?
            </label>
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={() => setIsScheduled(!isScheduled)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>

          {/* DateTime Picker */}
          {isScheduled && (
            <DateTimePicker
              selectedDate={scheduledTime}
              onChange={(date) => setScheduledTime(date)}
            />
          )}

          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={handlePost}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {loading
                ? isScheduled
                  ? "Scheduling..."
                  : "Posting..."
                : isScheduled
                ? "Schedule Post"
                : "Post to Facebook"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FacebookCreatePost;
