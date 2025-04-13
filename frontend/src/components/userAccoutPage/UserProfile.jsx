import React, { useState, useEffect, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";
import fetchData from "../../utils/fetchData";
import { gsap } from "gsap";

const UserProfile = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    const fetchUser = async () => {
      try {
        const response = await fetchData("/auth/profile", "GET");
        setUserData(response.data);
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
        setMessage("🎉 Profile updated successfully!");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      <div
        ref={cardRef}
        className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl min-h-[32rem]"
      >
        {/* Profile Image Section */}
        <div className="md:w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-10 space-y-6">
          <img
            src={userData.profilePic || "/user-profile-avatar.jpg"}
            alt="Profile"
            className="w-52 h-52 rounded-full border-4 border-white object-cover shadow-lg"
          />
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold">
              {userData.username || "Your Name"}
            </h3>
            <p className="text-gray-300 text-lg">
              {editMode
                ? "Keep your identity up to date."
                : "Hey there 👋 Update your info anytime!"}
            </p>
          </div>
        </div>

        {/* Info & Form Section */}
        <div className="md:w-1/2 p-12 relative flex flex-col justify-center">
          {!editMode && (
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              onClick={() => setEditMode(true)}
            >
              <FaPencilAlt size={20} />
            </button>
          )}

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {editMode ? "Edit Profile" : "Profile Overview"}
          </h2>
          <p className="text-gray-500 text-lg mb-6">
            {editMode
              ? "Update your profile and keep your info accurate and professional."
              : "Review your personal information below."}
          </p>

          {message && <p className="text-green-600 text-md mb-4">{message}</p>}
          {error && <p className="text-red-600 text-md mb-4">{error}</p>}

          {!editMode ? (
            <div className="space-y-6 text-lg">
              <div>
                <label className="block text-gray-600 text-sm">Username</label>
                <p className="text-gray-900 font-semibold">
                  {userData.username}
                </p>
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Email</label>
                <p className="text-gray-900 font-semibold">{userData.email}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  window.location = "/user/login";
                }}
                className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-md">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 text-lg rounded-xl focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-md">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  readOnly
                  className="w-full border px-4 py-3 text-lg rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6 rounded-xl transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
