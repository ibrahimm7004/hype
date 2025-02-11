import axiosInstance from "./axiosInstance";

const fetchData = async (
  url,
  method = "GET",
  data = null,
  headers = {},
  tokentype = "user"
) => {
  try {
    const userToken = localStorage.getItem("access_token"); // ✅ App User Token
    const twitterToken = localStorage.getItem("twitter_jwt_token"); // ✅ Twitter OAuth Token

    console.log("fetchData tokentype:", tokentype);

    let authToken = "";
    if (tokentype === "user" && userToken) {
      authToken = `Bearer ${userToken}`;
    } else if (tokentype === "twitter" && twitterToken) {
      authToken = `Bearer ${twitterToken}`;
    }

    const config = {
      url,
      method,
      data,
      headers: {
        ...headers,
        ...(authToken ? { Authorization: authToken } : {}), // ✅ Only add if not empty
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
    console.error("Error fetching data:", error);

    let errorMessage = "Something went wrong";
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.statusText;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export default fetchData;
