import React, { useState } from "react";
import { FaInstagram, FaCheckCircle } from "react-icons/fa";
import fetchData from "../../../utils/fetchData";

const SaveInstagramId = () => {
  const [saved, setSaved] = useState(
    localStorage.getItem("meta/instagram_authenticated") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const saveInstagramId = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await fetchData("/meta/instagram/save-id");
      localStorage.setItem("meta/instagram_authenticated", "true");
      setSaved(true);
      setSuccessMessage("Instagram ID successfully saved!");
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

      {!saved && (
        <button
          onClick={saveInstagramId}
          disabled={loading}
          className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Instagram ID"}
        </button>
      )}

      {error && <div className="text-red-500 text-center text-sm">{error}</div>}

      {successMessage && (
        <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
          <FaCheckCircle />
          {successMessage}
        </div>
      )}

      {saved && !successMessage && (
        <div className="text-green-600 text-sm text-center">
          Instagram ID is already saved.
        </div>
      )}
    </div>
  );
};

export default SaveInstagramId;
