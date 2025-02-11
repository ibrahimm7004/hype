import React, { useState, useRef } from "react";

const ChatTextInput = ({ setInterfaceState, setPromptText }) => {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // To handle button loading state
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setPromptText(event.target.value);
    setText(event.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setInterfaceState("qna");
    // Simulate loading state for button
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000); // Simulate a delay for generating
  };

  return (
    <div className="mx-auto p-8 rounded-lg min-h-[400px] max-w-xl w-full">
      <p className="text-gray-700 text-md font-light italic">
        <span className="font-semibold">Example: </span>
        Type a question, and we'll provide a response!
      </p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Enter your prompt here..."
        className="border border-gray-300 font-light w-full mt-4 outline-none text-gray-800 text-md rounded-lg px-4 py-2 resize-none overflow-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        rows={1}
        style={{ minHeight: "40px" }}
      />

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-600">{text.length} / 300</div>

        <button
          onClick={handleGenerate}
          className={`text-white ${
            isGenerating
              ? "bg-gray-500"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500"
          } transition duration-300 text-sm font-semibold rounded-md px-6 py-3 flex items-center space-x-2`}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6v6h6m0 0L4 6m6 6l6 6M10 6h4m0 0l6 6M10 6l6-6"
                />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatTextInput;
