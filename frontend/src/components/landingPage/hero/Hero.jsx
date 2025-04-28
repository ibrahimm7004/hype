import React from "react";

const Hero = ({ titleRef = null, subtitleRef = null, imgRef = null }) => {
  return (
    <section className="h-screen bg-gradient-to-br from-white via-blue-50 to-purple-200 p-10 py-20 relative z-10">
      <div className="w-full text-center ">
        <h1
          ref={titleRef}
          className="text-7xl font-extrabold tracking-tight text-gray-900"
        >
          HypeRadar
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-xl text-gray-700 max-w-xl mx-auto leading-relaxed"
        >
          Manage your all
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full mx-2 shadow-md">
            social media
          </span>
          apps at one place with <span className="font-semibold">AI</span>.
        </p>
      </div>
    </section>
  );
};

export default Hero;
