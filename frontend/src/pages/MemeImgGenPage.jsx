import React, { useState } from "react";
import { useEffect } from "react";
import ChatTextInput from "../components/memeImgGenPage/ChatTextInput";
import PromptQna from "../components/memeImgGenPage/PromptQna";
import fetchData from "../utils/fetchData";
import ImageGallery from "../components/aiMarketing/ImageGallery";
import CustomLoader from "../utils/CustomLoader";
import Intro from "../components/memeImgGenPage/Intro";

const MemeImgGenPage = () => {
  const [interfaceState, setInterfaceState] = useState("Intro");
  const [promptText, setPromptText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [promptQna, setPromptQna] = useState("");

  const [generatePost, setGeneratePost] = useState(null);
  const [localImgPaths, setLocalImgPaths] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      await generatePostHandler();
    };

    fetchData();
  }, []);

  return isLoading ? (
    <CustomLoader />
  ) : (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-8 px-4 bg-gradient-to-br from-pink-100 via-blue-100 to-white rounded-lg  sm:px-6 md:px-8">
      {/* Main container */}
      {interfaceState !== "gallery" && (
        <div className="bg-white rounded-lg shadow-lg w-full p-8">
          {/* Conditional rendering for different states */}

          {interfaceState === "Intro" && (
            <Intro setInterfaceState={setInterfaceState} />
          )}
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
