import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"; // use motion for animation like in FacebookCreatePost
import fetchData from "../../../utils/fetchData";
import DateTimePicker from "../../utils/DateTimePicker";

const InstagramCreatePost = ({ initialImage = "" }) => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    if (initialImage && initialImage.startsWith("http")) {
      fetchImageFromUrl(initialImage);
    }
  }, [initialImage]);

  const fetchImageFromUrl = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], "instagram-image.jpg", { type: blob.type });
      setImage(URL.createObjectURL(blob));
      setImageFile(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setImageUrl("");
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setImage(e.target.value);
  };

  const handlePost = async () => {
    if (!imageUrl && !imageFile) {
      setResponse({ error: "Please provide an image URL or upload a file." });
      return;
    }

    if (schedulePost && !scheduledDate) {
      setResponse({ error: "Please select a scheduled date and time." });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("post_type", schedulePost ? "scheduled" : "instant");
      if (schedulePost && scheduledDate) {
        formData.append("scheduled_time", scheduledDate.toISOString());
      }

      if (imageFile) {
        formData.append("image_file", imageFile);
      } else {
        formData.append("image_url", imageUrl);
      }

      const res = await fetchData("/meta/instagram/post", "POST", formData);

      if (res.error) {
        setResponse({ error: res.error });
      } else {
        setResponse({
          success: schedulePost
            ? "Post scheduled successfully!"
            : "Post shared successfully!",
        });
        setCaption("");
        setImageUrl("");
        setImageFile(null);
        setImage("");
        setScheduledDate(null);
        setSchedulePost(false);
      }
    } catch (err) {
      setResponse({ error: "Something went wrong while posting." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 text-gray-700">
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-16 pb-20 flex"
      >
        {/* Left Panel */}
        <div className="w-1/3 p-4 flex flex-col items-center border-r text-center">
          <motion.h2
            className="text-2xl font-bold text-pink-600 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share on Instagram 📸
          </motion.h2>
          <p className="text-gray-600 text-sm">
            Share moments, promotions, or updates with your Instagram followers.
          </p>
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
            alt="Instagram"
            className="w-20 h-20 mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>

        {/* Right Form */}
        <div className="w-2/3 p-6">
          <div className="space-y-4">
            {/* Caption */}
            <motion.textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            />

            {/* Image Preview */}
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

            {/* Upload or URL */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="insta-image-upload"
                  className="cursor-pointer text-pink-600 hover:underline"
                >
                  📷 Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="insta-image-upload"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={!!imageUrl}
                />
              </div>

              <input
                type="text"
                placeholder="...or paste image URL"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={!!imageFile}
              />
            </div>

            {/* Schedule Post */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-medium">
                ⏰ Schedule this post?
              </label>
              <input
                type="checkbox"
                checked={schedulePost}
                onChange={() => setSchedulePost(!schedulePost)}
                className="form-checkbox h-5 w-5 text-pink-600"
              />
            </div>

            {/* DateTime Picker */}
            {schedulePost && (
              <DateTimePicker
                selectedDate={scheduledDate}
                onChange={setScheduledDate}
              />
            )}

            {/* Post Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handlePost}
                disabled={loading}
                className={`px-6 py-2 rounded-full font-semibold text-white transition-all ${
                  loading
                    ? "bg-pink-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {loading
                  ? schedulePost
                    ? "Scheduling..."
                    : "Posting..."
                  : schedulePost
                  ? "Schedule Post"
                  : "Post to Instagram"}
              </motion.button>
            </div>

            {/* Response */}
            {response && (
              <div
                className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                  response.error
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {response.error || response.success}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstagramCreatePost;
