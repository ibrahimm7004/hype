import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetchData("/auth/login", "POST", formData);
      const data = response.data;

      if (response.status === 200) {
        setMessage("Login successful! 🎉 Redirecting...");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user_id", data.user_id);
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    gsap.from(".form-container", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".form-title", { opacity: 0, x: -100, duration: 1, delay: 0.4 });
    gsap.from(".form-input", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      delay: 0.4,
    });
    gsap.from(".form-button", {
      opacity: 0,
      y: -50,
      duration: 1,
      delay: 0.5,
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
      <div className="form-container w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <h2 className="form-title text-3xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Access your account to continue
        </p>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="form-button w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/user/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
