import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  faCalendarAlt,
  faImage,
  faHeading,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fetchData from "../../../utils/fetchData";

const ScheduleRedditPost = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    text: "",
    scheduled_time: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("user_id", formData.user_id);
    form.append("title", formData.title);
    form.append("text", formData.text);
    form.append("scheduled_time", formData.scheduled_time);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const response = await fetchData("/reddit/schedule-post", "POST", form);
      const result = response;
      console.log(result);
    } catch (error) {
      console.error("Error scheduling post:", error);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <img
          src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Reddit_Logo.png?width=400&height=400&name=Reddit_Logo.png"
          alt="Reddit"
          className="w-12 h-12 mr-3"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Schedule a Reddit Post
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center border border-gray-300 rounded-md p-2">
          <FontAwesomeIcon icon={faHeading} className="text-gray-500 mr-2" />
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full focus:outline-none"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md p-2">
          <FontAwesomeIcon icon={faKeyboard} className="text-gray-500 mr-2" />
          <textarea
            name="text"
            placeholder="Post Content"
            value={formData.text}
            onChange={handleChange}
            className="w-full focus:outline-none h-20"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md p-2">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="text-gray-500 mr-2"
          />
          <input
            type="datetime-local"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            className="w-full focus:outline-none"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md p-2">
          <FontAwesomeIcon icon={faImage} className="text-gray-500 mr-2" />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <motion.button
          onClick={handleSubmit}
          className="w-full bg-red-500 text-white font-medium py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          whileTap={{ scale: 0.95 }}
        >
          Schedule Post
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScheduleRedditPost;
