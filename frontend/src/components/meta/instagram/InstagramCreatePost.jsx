import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import fetchData from "../../../utils/fetchData";

const InstagramCreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
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

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl(""); // Clear URL input if uploading file
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Clear file if using URL
    setPreview(e.target.value);
  };

  const handlePost = async () => {
    if (!imageUrl && !imageFile) {
      setResponse({
        error: "Please provide either an image URL or upload a file.",
      });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (imageFile) {
        formData.append("image_file", imageFile);
      } else {
        formData.append("image_url", imageUrl);
      }

      const res = await fetchData("/meta/instagram/post", "POST", formData);
      if (res.error) {
        setResponse({ error: res.error });
      } else {
        setResponse({ success: "Post published successfully!" });
        setCaption("");
        setImageUrl("");
        setImageFile(null);
        setPreview("");
      }
    } catch (err) {
      setResponse({ error: "Something went wrong while posting." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="space-y-6 text-gray-700">
      <h2 className="text-xl font-bold text-pink-600">📸 Share on Instagram</h2>

      {/* Image URL */}
      <div>
        <label className="block font-semibold mb-1">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={!!imageFile}
        />
      </div>

      {/* OR File Upload */}
      <div>
        <label className="block font-semibold mb-1">Or Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
          disabled={!!imageUrl}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="rounded-md max-w-full" />
        </div>
      )}

      {/* Caption */}
      <div>
        <label className="block font-semibold mb-1">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="4"
          placeholder="Write your caption..."
          className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Post Button */}
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

      {/* Response */}
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
