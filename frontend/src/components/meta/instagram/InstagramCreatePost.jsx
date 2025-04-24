import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import fetchData from "../../../utils/fetchData";

const InstagramCreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const handlePost = async () => {
    if (!imageUrl) {
      setResponse({ error: "Image URL is required" });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetchData(
        "/meta/instagram/post",
        "POST",
        JSON.stringify({
          image_url: imageUrl,
          caption,
        })
      );

      if (res.error) {
        setResponse({ error: res.error });
      } else {
        setResponse({ success: "Post published successfully!" });
      }
    } catch (err) {
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="space-y-6 text-gray-700">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="img-preview"
            className="w-2/3 rounded-md my-2 "
          />
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="4"
          placeholder="Write your caption..."
          className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <button
        onClick={handlePost}
        disabled={loading}
        className={`w-full py-2 rounded-xl text-white font-semibold transition duration-300 ${
          loading
            ? "bg-pink-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {loading ? "Posting..." : "Post to Instagram"}
      </button>

      {response && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm font-medium ${
            response.error
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {response.error || response.success}
        </div>
      )}
    </div>
  );
};

export default InstagramCreatePost;
