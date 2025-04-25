import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faBold,
  faItalic,
  faPaperPlane,
  faTrash,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";
import DateTimePicker from "../utils/DateTimePicker";

const RedditCreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);

  const handlePostSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert("Title and body cannot be empty!");
      return;
    }

    if (schedule && !scheduledTime) {
      alert("Please pick a time to schedule your post.");
      return;
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("Please login first");
      return;
    }

    setWaiting(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", body);
    formData.append("schedule", schedule);
    if (schedule && scheduledTime) {
      formData.append("scheduled_time", new Date(scheduledTime).toISOString());
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const result = await fetchData(
      `/reddit/post?user_id=${user_id}`,
      "POST",
      formData,
      true
    );

    setWaiting(false);
    setSuccess(true);

    alert(result.data.message);
    console.log("Post response:", result);
  };

  const WaitingScreen = () => (
    <motion.div
      className="text-center p-6 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold mb-4">Posting in Progress...</p>
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-gray-400 text-3xl animate-spin mb-4"
      />
      <p className="text-sm text-gray-500">
        Please wait while we are preparing your post. This won't take long!
      </p>
    </motion.div>
  );

  const SuccessScreen = () => (
    <motion.div
      className="text-center p-6 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-2xl font-semibold text-green-500 mb-4">
        {schedule
          ? "Post Scheduled Successfully!"
          : "Post Created Successfully!"}
      </p>
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-green-500 text-5xl mb-4"
      />
      <p className="text-sm text-gray-500">
        {schedule
          ? `Your post has been successfully scheduled for ${new Date(
              scheduledTime
            ).toLocaleString()}`
          : "Your post has been successfully submitted to Reddit."}
      </p>

      <button
        onClick={() => {
          setSuccess(false);
          setWaiting(false);
          setTitle("");
          setBody("");
          setSelectedFile(null);
          setSchedule(false);
          setScheduledTime(null);
        }}
        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        Repost
      </button>
    </motion.div>
  );

  return (
    <>
      {waiting && <WaitingScreen />}
      {success && <SuccessScreen />}

      {!waiting && !success && (
        <motion.div
          className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-xl flex items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Side - Reddit Branding */}
          <div className="w-1/3 flex flex-col items-center">
            <img
              src="https://cdn.pixabay.com/photo/2021/09/11/12/17/reddit-6615447_1280.png"
              alt="Reddit"
              className="w-16 mb-2"
            />

            <h2 className="text-xl font-bold text-orange-600">
              Post on Reddit
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Share your thoughts, memes, or discussions with the community!
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-2/3 p-4">
            <motion.input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />

            <motion.textarea
              className="w-full mt-3 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Write something..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              whileFocus={{ scale: 1.05 }}
            ></motion.textarea>

            {/* Formatting Icons */}
            <div className="flex items-center space-x-4 text-gray-600 mt-3">
              <motion.div
                className="cursor-pointer hover:text-orange-500"
                whileHover={{ scale: 1.2 }}
              >
                <FontAwesomeIcon icon={faBold} />
              </motion.div>
              <motion.div
                className="cursor-pointer hover:text-orange-500"
                whileHover={{ scale: 1.2 }}
              >
                <FontAwesomeIcon icon={faItalic} />
              </motion.div>
              <motion.label
                className="cursor-pointer hover:text-orange-500"
                whileHover={{ scale: 1.2 }}
              >
                <FontAwesomeIcon icon={faImage} />
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </motion.label>
            </div>

            {/* Image Preview */}
            {selectedFile && (
              <motion.div
                className="mt-3 flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-gray-600">📎 {selectedFile.name}</p>
                <motion.button
                  className="text-red-500"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedFile(null)}
                >
                  ✖
                </motion.button>
              </motion.div>
            )}

            {/* Schedule Post Option */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={schedule}
                  onChange={(e) => setSchedule(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-orange-600"
                />
                <span>Schedule this post?</span>
              </label>

              {schedule && (
                <div className="mt-2">
                  <DateTimePicker
                    selectedDate={scheduledTime}
                    onChange={setScheduledTime}
                  />
                  {scheduledTime && (
                    <p className="mt-2 text-sm text-gray-500">
                      Scheduled for: {new Date(scheduledTime).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <motion.button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setTitle("");
                  setBody("");
                  setSelectedFile(null);
                  setSchedule(false);
                  setScheduledTime(null);
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Discard
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
                onClick={handlePostSubmit}
                whileHover={{ scale: 1.05 }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                {schedule ? "Schedule Post" : "Post"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default RedditCreatePost;
