import React, { useState, useRef, useEffect } from "react";
import { FaInstagram, FaCheckCircle, FaSave } from "react-icons/fa";
import gsap from "gsap";
import axios from "axios";
import fetchData from "../../../utils/fetchData";

const SaveInstagramId = () => {
  const [instagram, setInstagram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const getInstagramInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchData("/meta/facebook/connected-instagram");
      if (res?.data?.id) {
        setInstagram(res.data);
      } else {
        setError("No connected Instagram account found.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch Instagram account.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetchData("/meta/instagram/save-id"); // No data, all context is backend-handled
      setSaved(true);
      console.log("handle save resp:", response);
      // setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save Instagram ID.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 space-y-6"
    >
      <div className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
        <FaInstagram className="text-pink-500 text-3xl" />
        Instagram Business Account
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition"
      >
        {loading ? "Fetching..." : "Get Instagram Info"}
      </button>

      {error && <div className="text-red-500 text-center text-sm">{error}</div>}

      {instagram && (
        <div className="border rounded-xl p-4 bg-gray-50 flex items-center justify-between">
          <div>
            <div className="text-gray-700 font-semibold">
              @{instagram.username || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">ID: {instagram.id}</div>
          </div>
          <FaCheckCircle className="text-green-500 text-xl" />
        </div>
      )}

      {instagram && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
          >
            <FaSave />
            Save Instagram ID
          </button>
        </div>
      )}

      {saved && (
        <div className="text-green-600 text-sm text-center flex items-center justify-center gap-1 mt-2">
          <FaCheckCircle />
          Instagram ID saved successfully!
        </div>
      )}
    </div>
  );
};

export default SaveInstagramId;
