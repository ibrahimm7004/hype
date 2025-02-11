import React, { useState } from "react";

const SchedulePost = () => {
  const [tweet, setTweet] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const handleSchedule = () => {
    if (!tweet.trim()) {
      alert("Tweet cannot be empty!");
      return;
    }
    if (!scheduleDate) {
      alert("Please select a date and time!");
      return;
    }
    alert(`Tweet scheduled for: ${scheduleDate}`);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule a Tweet</h2>

      <textarea
        className="w-full p-3 border rounded-lg focus:outline-blue-500"
        rows="4"
        placeholder="What's happening?"
        maxLength="280"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      ></textarea>

      <input
        type="datetime-local"
        className="w-full mt-3 p-2 border rounded-lg focus:outline-blue-500"
        value={scheduleDate}
        onChange={(e) => setScheduleDate(e.target.value)}
      />

      <button
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={handleSchedule}
      >
        Schedule Tweet
      </button>
    </div>
  );
};

export default SchedulePost;
