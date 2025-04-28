import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const ChatTextInput = ({ setInterfaceState, setPromptText }) => {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const cardRef = useRef(null);

  const handleChange = (event) => {
    setPromptText(event.target.value);
    setText(event.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      gsap.to(textarea, {
        height: textarea.scrollHeight,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setInterfaceState("qna");
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.2,
      ease: "power1.out",
    });
    setTimeout(() => {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power1.out",
      });
      setIsGenerating(false);
    }, 1200);
  };

  useEffect(() => {
    adjustHeight();
    // Animate card on mount
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className=" flex flex-col items-center justify-center px-4">
      <div className="text-center text-gray-700 mb-8">
        <h1 className="font-bold text-4xl mb-3 tracking-tight">
          Generate Post
        </h1>
        <p className="w-full max-w-md text-md font-light text-gray-500 mx-auto leading-relaxed">
          Enter your prompt below and we’ll craft a perfect marketing post with
          a title, body, and hashtags to boost your reach!
        </p>
      </div>

      <div
        ref={cardRef}
        className="w-full max-w-xl p-6 rounded-2xl border border-gray-200 bg-white shadow-xl transition-all"
      >
        <p className="text-gray-400 text-sm font-light italic mb-2">
          <span className="font-semibold text-gray-600">Example: </span>
          "What's a catchy Instagram post for a coffee shop?"
        </p>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Type your prompt here..."
          className="w-full font-light mt-3 outline-none text-gray-700 text-base rounded-xl px-4 py-3 resize-none overflow-hidden bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
          rows={1}
          maxLength={300}
          style={{ minHeight: "50px" }}
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">{text.length} / 300</div>

          <button
            ref={buttonRef}
            onClick={handleGenerate}
            className={`text-white ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-indigo-400 to-purple-500 hover:from-purple-400 hover:to-indigo-500"
            } px-6 py-2 rounded-full text-sm font-semibold shadow-md flex items-center gap-2 transition-transform transform hover:scale-105 active:scale-95`}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTextInput;
