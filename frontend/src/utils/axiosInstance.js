import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://65.0.30.234/api", // Backend API URL
});

// Automatically attach token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to Handle Token Expiry
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("🔴 Access token expired. Please log in again.");

      // Show an alert or redirect manually
      alert("Your session has expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
