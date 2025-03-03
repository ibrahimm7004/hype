import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import fetchData from "../../utils/fetchData";

const ScheduleTweet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tweetText, setTweetText] = useState("");
  const [image, setImage] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [hasText, setHasText] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const userId = localStorage.getItem("user_id");
  const savedText = localStorage.getItem("scheduled_tweet_text") || "";
  const savedImage = localStorage.getItem("scheduled_tweet_image");

  useEffect(() => {
    // Read URL params
    const queryParams = new URLSearchParams(location.search);
    const hasTextParam = queryParams.get("has_text") === "true";
    const hasImageParam = queryParams.get("has_image") === "true";

    setHasText(hasTextParam);
    setHasImage(hasImageParam);

    // Load the data from localStorage if available
    if (savedText) {
      setTweetText(savedText);
    }
    if (savedImage) {
      setImage(savedImage);
    }
  }, [location.search, savedText, savedImage]);

  // Handle the schedule tweet
  const handleSchedule = async () => {
    if (!tweetText || !scheduledTime) {
      alert("Please enter a tweet and select a time to schedule.");
      return;
    }

    const tweetData = {
      user_id: userId,
      tweet_text: tweetText,
      image_url: image || null,
      scheduled_time: scheduledTime,
      posted: false,
    };

    // Send data to backend (this example assumes you're using an API route to save the data)
    try {
      const response = await fetchData(
        "/twitter/schedule-tweet",
        "POST",
        tweetData
      );

      if (response.status === 200) {
        alert("Tweet scheduled successfully!");
        navigate("/dashboard"); // Navigate to the dashboard or home after success
      } else {
        alert("Failed to schedule tweet.");
      }
    } catch (error) {
      console.error("Error scheduling tweet:", error);
      alert("An error occurred while scheduling the tweet.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">
          Schedule a Tweet
        </h2>
        <div className="space-y-6">
          {/* Tweet Text */}
          <div className="flex flex-col">
            <label
              htmlFor="tweetText"
              className="text-lg font-medium text-gray-700 mb-2"
            >
              Tweet Text
            </label>
            <textarea
              id="tweetText"
              className="border-2 border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Write your tweet here..."
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              rows="4"
            />
          </div>

          {/* Image Upload */}
          {hasImage && (
            <div className="flex flex-col mb-6">
              <label className="text-lg font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md">
                <FontAwesomeIcon
                  icon={faImage}
                  size="3x"
                  className="text-gray-400 mb-3"
                />
                <div className="text-gray-500">
                  {image ? "Image uploaded" : "No image selected"}
                </div>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          )}

          {/* Schedule Time */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-2">
              Scheduled Time
            </label>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                size="lg"
                className="mr-2 text-gray-500"
              />
              <input
                type="datetime-local"
                className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleSchedule}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
          >
            Schedule Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTweet;
