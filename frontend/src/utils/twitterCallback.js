import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Backend API URL

  //   headers: {
  //     "Content-Type": "application/json", // Default for JSON
  //   },
});

const twitterCallback = async (
  url,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
    const twitterToken = localStorage.getItem("twitter_jwt_token"); // ✅ Twitter OAuth Token
    console.log("twitterToken:", typeof twitterToken, twitterToken);
    if (twitterToken === null) {
      throw new Error("Twitter OAuth Token not found");
    }

    let authToken = `Bearer ${twitterToken}`;
    // Do not set Content-Type if data is FormData, let axios handle it
    const config = {
      url,
      method,
      data,
      headers: {
        ...headers,
        ...(authToken ? { Authorization: authToken } : {}),
      },
    };

    // If data is FormData, do not manually set the Content-Type
    if (data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json"; // For regular JSON requests
    }

    const response = await axiosInstance(config);

    return response;
  } catch (error) {
    console.error("Error fetching data (twitter callback):", error);

    let errorMessage = "Something went wrong";
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.statusText;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export default twitterCallback;
