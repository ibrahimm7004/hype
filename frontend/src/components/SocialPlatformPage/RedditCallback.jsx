import React, { useEffect, useState } from "react";
import fetchData from "../../utils/fetchData";
import { Loader2 } from "lucide-react";

const RedditCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedditCallback = async () => {
      try {
        console.log("Reddit Callback");
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code || !state) {
          throw new Error("Missing authentication parameters");
        }

        const response = await fetchData(
          `/reddit/callback?code=${code}&state=${state}`,
          "GET"
        );
        console.log("Reddit callback response:", response);
      } catch (err) {
        console.error("Error handling Reddit callback:", err);
        setError(err.message);
      } finally {
        setLoading(false);

        // Redirect to Reddit Profile Page
        window.location.href = "/social-platform/profiles";
      }
    };

    handleRedditCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Redirection in Progress...
      </h1>
      {loading ? (
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <p className="text-green-600 text-lg">
          Successfully authenticated! Redirecting...
        </p>
      )}
      <img
        src="https://cdn.pixabay.com/photo/2013/07/13/12/04/android-159109_960_720.png"
        alt="Robot-illustration"
        className="w-64 h-auto mt-6 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default RedditCallback;
