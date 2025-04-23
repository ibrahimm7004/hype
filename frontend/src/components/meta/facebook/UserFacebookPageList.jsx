import React, { useState, useEffect, useRef } from "react";
import { FaFacebook, FaCheckCircle, FaSave } from "react-icons/fa";
import gsap from "gsap";
import axios from "axios";
import fetchData from "../../../utils/fetchData";
import FacebookPageSelector from "./FacebookPageSelector";

const UserFacebookPageList = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const getFacebookPages = async () => {
    setLoading(true);
    try {
      const response = await fetchData("/meta/facebook/get-user-pages");
      setPages(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedPage) {
      console.log("no page selected", selectedPage);
      return;
    }

    try {
      const response = await fetchData("/meta/facebook/save-page", "POST", {
        page_id: selectedPage.id,
        page_access_token: selectedPage.access_token,
      });

      localStorage.setItem("facebook_page_id", selectedPage.id);

      console.log("handle save", response);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 text-gray-800 text-2xl font-semibold">
        <FaFacebook className="text-blue-600 text-3xl" />
        Facebook Pages
      </div>

      <button
        onClick={getFacebookPages}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
      >
        {loading ? "Fetching..." : "Get Facebook Pages"}
      </button>

      {pages.length > 0 && (
        <FacebookPageSelector
          pages={pages}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}

      {selectedPage && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
          >
            <FaSave />
            Save Selection
          </button>
        </div>
      )}

      {saved && (
        <div className="text-green-600 text-sm text-center flex items-center justify-center gap-1 mt-2">
          <FaCheckCircle />
          Page saved successfully!
        </div>
      )}
    </div>
  );
};

export default UserFacebookPageList;
