import React, { useState } from "react";
import { motion } from "framer-motion";
import fetchData from "../../../utils/fetchData";

const FacebookCreatePost = ({ initialText = "", initialImage = "" }) => {
  const [postText, setPostText] = useState(initialText);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [charCount, setCharCount] = useState(initialText.length);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_CHAR_COUNT = 5000; // Facebook character limit

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
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handlePost = async () => {
    if (postText.length === 0 && !imageFile) {
      alert("Post must have text or an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("post_text", postText);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetchData("/meta/facebook/post", "POST", formData);
      console.log(response);

      if (response && response.status === 200) {
        alert("Post shared successfully!");
        setPostText("");
        setCharCount(0);
        setImage(null);
        setImageFile(null);
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
        {/* Left Info Panel */}
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

        {/* Right Form Panel */}
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

          {image && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={image}
                alt="Preview"
                className="max-w-full rounded-md"
              />
            </motion.div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <label
              htmlFor="fb-image-upload"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              📷 Add Photo
            </label>
            <input
              type="file"
              accept="image/*"
              id="fb-image-upload"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex items-center gap-2">
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
              onClick={handlePost}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Posting..." : "Post to Facebook"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FacebookCreatePost;
