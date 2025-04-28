import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TextGenIntro = ({ setInterfaceState }) => {
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      imgRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 }
    )
      .fromTo(
        textRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2 },
        "-=0.8"
      );
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-10 bg-white pt-32">
      {/* Image Section */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <img
          ref={imgRef}
          src="/hands-typing-on-keyboard.jpg"
          alt="Typing on Keyboard"
          className="rounded-2xl shadow-lg w-full object-cover"
        />
      </div>

      {/* Text Section */}
      <div
        ref={textRef}
        className="w-full md:w-1/2 px-6 md:px-12 text-center md:text-left"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Generate Engaging Texts Instantly
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Effortlessly create smart and catchy text for your social media —
          whether it's comments, captions, bios, DMs, or status updates. Powered
          by AI to save your time and boost your creativity.
        </p>
        <button
          ref={buttonRef}
          onClick={() => {
            setInterfaceState("prompt");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default TextGenIntro;
