import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Intro = ({ setInterfaceState }) => {
  const gridRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      gridRef.current.querySelectorAll("img"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6 },
        "-=0.9"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.1 },
        "-=0.9"
      );
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-10 bg-gray-50">
      {/* Left Grid */}
      <div ref={gridRef} className="w-full md:w-2/5 grid grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <img
            src="/cartoon-images/1.jpg"
            alt=""
            className="h-[60%] w-full object-cover rounded-2xl shadow-md flex-1"
          />
          <img
            src="/cartoon-images/2.jpg"
            alt=""
            className="h-[40%] w-full object-cover rounded-2xl shadow-md flex-1"
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <img
            src="/cartoon-images/3.jpg"
            alt=""
            className="h-[40%] w-full object-cover rounded-2xl shadow-md flex-1"
          />
          <img
            src="/cartoon-images/4.webp"
            alt=""
            className="h-[60%] w-full object-cover rounded-2xl shadow-md flex-1"
          />
        </div>
      </div>

      {/* Right Text */}
      <div className="w-full md:w-3/5 flex justify-center p-10">
        <div ref={textRef} className="max-w-md text-center md:text-left mt-20">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Market Using Memes
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Gone are those traditional marketing days. Generate hilarious,
            trending memes with one click and watch your engagement skyrocket.
          </p>
          <button
            ref={buttonRef}
            onClick={() => {
              setInterfaceState("textPrompt");
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
          >
            Generate Meme
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
