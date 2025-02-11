import React, { useState } from "react";
import { useEffect } from "react";
import ChatTextInput from "../components/memeImgGenPage/ChatTextInput";
import PromptQna from "../components/memeImgGenPage/PromptQna";
import fetchData from "../utils/fetchData";
import ImageGallery from "../components/aiMarketing/ImageGallery";
import CustomLoader from "../utils/CustomLoader";

const MemeImgGenPage = () => {
  const [interfaceState, setInterfaceState] = useState("gallery");
  const [promptText, setPromptText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [promptQna, setPromptQna] = useState("");

  const [generatePost, setGeneratePost] = useState(null);
  const [localImgPaths, setLocalImgPaths] = useState([
    "http://localhost:5000/static/generated-memes/Papa-Fking-John_meme.jpg",
    "http://localhost:5000/static/generated-memes/Drunk-Baby_meme.jpg",
    "http://localhost:5000/static/generated-memes/But-Thats-None-Of-My-Business_meme.jpg",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const generatePostHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        "/ai/meme-gen/generate",
        "POST",
        JSON.stringify({
          promptText: promptText,
          promptQna: promptQna,
        })
      );

      const result = response.data;
      console.log(result.image_urls);
      setLocalImgPaths(result.image_urls);
      setInterfaceState("gallery");
      setIsLoading(false);
      console.log("Post Generation Response:", result);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating post:", error);
    }
  };

  return isLoading ? (
    <CustomLoader />
  ) : (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-8 px-4  sm:px-6 md:px-8">
      {/* Main container */}
      {interfaceState !== "gallery" && (
        <div className="bg-white rounded-lg shadow-lg w-5/6 p-8">
          <div className="text-center text-gray-700 mb-8">
            <h1 className="font-bold text-4xl mb-2">Generate Post</h1>
            <p className="w-1/2 text-md font-light text-center mx-auto">
              Enter your prompt below, and we’ll generate a perfect marketing
              post with an engaging title, body, and hashtags to improve its
              reach!
            </p>
          </div>

          {/* Conditional rendering for different states */}
          {interfaceState === "textPrompt" && (
            <ChatTextInput
              setPromptText={setPromptText}
              setInterfaceState={setInterfaceState}
            />
          )}

          {interfaceState === "qna" && (
            <PromptQna
              setPromptQna={setPromptQna}
              generatePostHandler={generatePostHandler}
            />
          )}

          {/* Loading Spinner while generating */}
          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <svg
                className="animate-spin h-6 w-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Image Gallery */}
      {interfaceState === "gallery" && (
        <ImageGallery
          imageUrls={localImgPaths}
          setInterfaceState={setInterfaceState}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
};

export default MemeImgGenPage;
