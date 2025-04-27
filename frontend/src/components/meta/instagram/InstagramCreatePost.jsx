import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
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
    gsap.from(formRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

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
      setResponse({
        error: "Please provide either an image URL or upload a file.",
      });
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
            : "Post published successfully!",
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
    <div ref={formRef} className="space-y-6 text-gray-700">
      <h2 className="text-xl font-bold text-pink-600">📸 Share on Instagram</h2>

      {/* Image URL */}
      <div>
        <label className="block font-semibold mb-1">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={!!imageFile}
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block font-semibold mb-1">Or Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
          disabled={!!imageUrl}
        />
      </div>

      {/* image */}
      {image && (
        <div className="mt-2">
          <img src={image} alt="image" className="rounded-md max-w-full" />
        </div>
      )}

      {/* Caption */}
      <div>
        <label className="block font-semibold mb-1">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="4"
          placeholder="Write your caption..."
          className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Schedule Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={schedulePost}
          onChange={() => setSchedulePost(!schedulePost)}
          className="accent-pink-600"
        />
        <label className="text-sm font-medium">📅 Schedule this post</label>
      </div>

      {/* Conditional DateTime Picker */}
      {schedulePost && (
        <DateTimePicker
          selectedDate={scheduledDate}
          onChange={setScheduledDate}
        />
      )}

      {/* Post Button */}
      <button
        onClick={handlePost}
        disabled={loading}
        className={`w-full py-2 rounded-xl text-white font-semibold transition duration-300 ${
          loading
            ? "bg-pink-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {loading
          ? schedulePost
            ? "Scheduling..."
            : "Posting..."
          : schedulePost
          ? "Schedule Post"
          : "Post to Instagram"}
      </button>

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
  );
};

export default InstagramCreatePost;
