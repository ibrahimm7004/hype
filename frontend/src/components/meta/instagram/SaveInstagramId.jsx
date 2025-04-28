import React, { useState, useEffect } from "react";
import { FaInstagram, FaCheckCircle, FaFacebook } from "react-icons/fa";
import fetchData from "../../../utils/fetchData";

const SaveInstagramId = () => {
  const [saved, setSaved] = useState(
    localStorage.getItem("meta/instagram_authenticated") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [facebookLinked, setFacebookLinked] = useState(
    localStorage.getItem("meta/facebook_authenticated") === "true"
  );

  useEffect(() => {
    // Check if Facebook is linked and provide an appropriate message
    if (!facebookLinked) {
      setError("You must first link your Facebook account to continue.");
    }
  }, [facebookLinked]);

  const saveInstagramId = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Ensure Facebook is linked before proceeding
    if (!facebookLinked) {
      setError("You must link your Facebook account first to use Instagram.");
      setLoading(false);
      return;
    }

    try {
      // Simulating the save action, assuming this API links Instagram to the authenticated Facebook account
      await fetchData("/meta/instagram/save-id");
      localStorage.setItem("meta/instagram_authenticated", "true");
      setSaved(true);
      setSuccessMessage("Instagram ID successfully saved!");
      setTimeout(() => {
        // After success, redirect to the profiles page
        window.location = "/social-platform/profiles";
      }, 1000);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save Instagram ID.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
        <FaInstagram className="text-pink-500 text-3xl" />
        Instagram Business Account
      </div>

      {/* Show Facebook linking status */}
      {!facebookLinked && (
        <div className="text-red-500 text-center text-sm mt-4">
          <FaFacebook className="inline-block text-red-500 mr-2" />
          You need to first link your <strong>Facebook</strong> account to
          continue. Only Instagram accounts linked to an authenticated Facebook
          page can be used.
        </div>
      )}

      {/* Detailed instructions if Instagram is not saved */}
      {!saved && facebookLinked && (
        <div className="text-center text-sm text-gray-700">
          <p className="mb-2">
            To proceed, we will link your Instagram Business account to your
            authenticated Facebook page. This allows us to save your Instagram
            ID securely.
          </p>
          <button
            onClick={saveInstagramId}
            disabled={loading}
            className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Instagram ID"}
          </button>
        </div>
      )}

      {/* Show any error messages */}
      {error && <div className="text-red-500 text-center text-sm">{error}</div>}

      {/* Show success message */}
      {successMessage && (
        <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
          <FaCheckCircle />
          {successMessage}
        </div>
      )}

      {/* If Instagram ID is already saved, inform the user */}
      {saved && !successMessage && (
        <div className="text-green-600 text-sm text-center">
          Your Instagram ID has already been saved. You can proceed to manage
          your profiles.
        </div>
      )}

      {/* Detailed description for users who already have their Instagram ID saved */}
      {saved && !error && !successMessage && (
        <div className="text-center text-sm text-gray-700">
          <p>
            Your Instagram account is already linked. If you'd like to make any
            changes, you can disconnect and reconnect your Instagram account
            from the profiles section.
          </p>
        </div>
      )}
    </div>
  );
};

export default SaveInstagramId;
