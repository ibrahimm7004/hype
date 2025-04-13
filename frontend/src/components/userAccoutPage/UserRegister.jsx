import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetchData("/auth/register", "POST", formData);
      console.log("Response (register):", response);
      const data = await response.data;

      if (response.status == 200 || response.status == 201) {
        setMessage("User registered successfully! 🎉");
        setFormData({ username: "", email: "", password: "" });
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError(
        err.response.data.error || "Registration failed. Please try again."
      );
    }

    setLoading(false);
  };

  // GSAP animation on component mount
  useEffect(() => {
    gsap.from(".form-container", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".form-title", { opacity: 0, x: -100, duration: 1, delay: 0.5 });
    gsap.from(".form-input", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      delay: 1,
    });
    gsap.from(".form-button", { opacity: 0, y: 50, duration: 0.8, delay: 1.5 });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-purple-100 via-indigo-50 to-white">
      <div className="form-container w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <h2 className="form-title text-3xl font-bold text-center text-gray-700 mb-6">
          Register
        </h2>
        <p className="text-center text-gray-500 mb-6">Create a new account</p>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-button w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
