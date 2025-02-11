import React, { useState } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import fetchData from "../utils/fetchData";
import { Loader, Palette } from "lucide-react";
import CustomLoader from "../utils/CustomLoader";
import MemeTextResults from "../components/aiMarketing/MemeTextResults";

const audienceOptions = [
  "Gen Alpha (Under 13)",
  "Gen Z (13-17)",
  "Young Adults / Gen Z (18-24)",
  "Millennials (25-34)",
  "Gen X / Adults (35-50)",
  "Boomers / Older Adults (50+)",
  "General Audience (All Ages)",
].map((item) => ({ value: item, label: item }));

const ctaOptions = [
  "Like",
  "Share",
  "Follow",
  "Comment",
  "Tag Someone",
  "Click a Link",
  "Shop Now",
  "Sign Up",
  "DM Us",
  "Save this Post",
  "Turn on Notifications",
  "Watch Now",
  "Try it Today",
  "Join the Community",
].map((item) => ({ value: item, label: item }));

const MemeTextGenPage = () => {
  const [formData, setFormData] = useState({
    location: "",
    language: "",
    trendy_humour: true,
    audience_type: [],
    CTA: [],
    type_post: true, // true = Post, false = Poll
    prompt: "",
  });
  const [response, setResponse] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (name, selectedOptions) => {
    setFormData({
      ...formData,
      [name]: selectedOptions.map((option) => option.value),
    });
  };

  const handleToggle = (name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
      CTA:
        name === "type_post" && !prevState.type_post ? ["Vote"] : prevState.CTA,
    }));
  };

  const handleSubmit = async () => {
    if (formData.prompt.length > 300) {
      alert("Prompt must be under 300 characters!");
      return;
    }

    try {
      //   console.log("formData before sending", formData);
      setLoading(true);
      const response = await fetchData("/ai/meme-gen/text", "POST", formData);
      setLoading(false);
      setResponse(response.data);
      // alert("Post Generated Successfully!");
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting post:", error);
      alert("Failed to generate post.");
    }
  };

  const handleRegenerate = () => {
    setResponse("");
  };

  return isLoading ? (
    <CustomLoader />
  ) : response ? (
    <MemeTextResults
      text={response.results}
      handleRegenerate={handleRegenerate}
    />
  ) : (
    <div className="flex flex-col items-center bg-[#F7F9FA] min-h-screen p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-[#1DA1F2] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Meme Text Generator
      </motion.h1>

      {/* Form Container */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl space-y-6">
        {/* Location Input */}
        <div>
          <label className="block text-gray-700 font-medium ">
            🌍 Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter City, Country"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full mt-2 p-3 border rounded-lg"
          />
        </div>

        {/* Language Input */}
        <div>
          <label className="block text-gray-700 font-medium">🗣️ Language</label>
          <input
            type="text"
            name="language"
            placeholder="Enter Language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full mt-2 p-3 border rounded-lg"
          />
        </div>
        <div className="flex justify-between">
          {/* Audience Type Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">
              👥 Audience Type
            </label>
            <Select
              isMulti
              options={audienceOptions}
              className="mt-2 w-64"
              onChange={(selected) =>
                handleDropdownChange("audience_type", selected)
              }
            />
          </div>

          {/* CTA Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">
              🎯 Call To Action
            </label>
            <Select
              isMulti
              options={ctaOptions}
              isDisabled={!formData.type_post} // Disable when Poll is selected
              className="mt-2 w-64"
              onChange={(selected) => handleDropdownChange("CTA", selected)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          {/* Trendy Humour Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium mr-4">
              🔥 Trendy Humour?
            </span>
            <button
              onClick={() => handleToggle("trendy_humour")}
              className={`w-16 h-8 flex items-center rounded-full transition-all duration-300 ${
                formData.trendy_humour ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: formData.trendy_humour ? 24 : 0 }}
              />
            </button>
          </div>

          {/* Type of Post Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium mr-4">
              📢 Post Type: {formData.type_post ? "Post" : "Poll"}
            </span>
            <button
              onClick={() => handleToggle("type_post")}
              className={`w-16 h-8 flex items-center rounded-full transition-all duration-300 ${
                formData.type_post ? "bg-blue-500" : "bg-yellow-500"
              }`}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: formData.type_post ? 24 : 0 }}
              />
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-gray-700 font-medium">📝 Prompt</label>
          <textarea
            name="prompt"
            placeholder="Enter your prompt (Max 300 characters)"
            value={formData.prompt}
            onChange={handleInputChange}
            maxLength="300"
            className="w-full mt-2 p-3 border rounded-lg resize-none h-24"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          className="w-full bg-[#1DA1F2] text-white py-3 rounded-lg shadow-lg hover:bg-[#1A91DA] transition"
        >
          🚀 Generate Post
        </motion.button>
      </div>
    </div>
  );
};

export default MemeTextGenPage;
