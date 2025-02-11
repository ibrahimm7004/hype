import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";
import { FaPencilAlt } from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData("/auth/profile", "GET");
        setUserData(response.data);
        console.log("User Data:", response.data);

        localStorage.setItem("user_display_name", response.data.username);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetchData("/auth/update-profile", "PUT", userData);
      if (response.status === 200) {
        setMessage("Profile updated successfully.");
        setEditMode(false);
      } else {
        setError(response.data.error || "Update failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Update failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex relative items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative max-w-md bg-white shadow-sm rounded-lg p-6 -mt-40"
      >
        {!editMode && (
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setEditMode(true)}
          >
            <FaPencilAlt className="text-sm" />
          </button>
        )}

        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {editMode ? "Edit Profile" : "Profile"}
        </h2>
        <p className="text-center text-gray-500 mb-4">
          {editMode ? "Update your details" : "Manage your account"}
        </p>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {!editMode ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
              <img
                src={
                  userData.profilePic ||
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800">
                {userData.username}
              </h3>
              <p className="text-gray-500">{userData.email}</p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location = "/user/login";
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                readOnly
                className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfile;
