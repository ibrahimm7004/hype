import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import fetchData from "../../utils/fetchData";
import { getElementAtEvent } from "react-chartjs-2";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    setUploading(true);
    setMessage("");

    const formData = new FormData();

    formData.append("text", "test");
    formData.append("file", file);
    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Should print: "file" File { ... }
    }
    // const result = await fetchData("http://127.0.0.1:8000/cloudinary/upload", "POST", formData, true);
    const result = await fetchData("/cloudinary/upload", "POST", formData);
    if (result.error) {
      setMessage(`Upload failed: ${result.error}`);
    } else {
      setMessage("Upload successful!");
      console.log("Uploaded Image:", result.data);
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-md mx-auto mb-4"
          />
        )}

        {/* File Input */}
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 border p-2 w-full rounded-md"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full hover:bg-blue-600 transition"
          disabled={uploading}
        >
          <FaCloudUploadAlt />
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Status Message */}
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
