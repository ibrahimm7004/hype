import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Features from "../Features";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // On-load animation
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.5"
      )
      .fromTo(
        imgRef.current,
        { y: 50, scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.2 },
        "-=0.8"
      );

    // Scroll-triggered timeline for image movement
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#features",
        start: "top center",
        endTrigger: "#end",
        end: "bottom center",
        scrub: true,
      },
    });

    scrollTl
      .to(imgRef.current, { width: "500px", x: "40vw", duration: 1 }) // move right
      .to(imgRef.current, { x: "0vw", duration: 1 }) // back to center
      .to(imgRef.current, { x: "-40vw", duration: 1 }); // move left
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      {/* Floating Hero Image (fixed to bottom center) */}
      <img
        ref={imgRef}
        src="/hero-img.png"
        alt="Hero"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-3/5 max-w-3xl z-50 pointer-events-none "
      />

      {/* Hero Section */}
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

      {/* Features Section */}
      <section
        id="features"
        className="h-screen  bg-gradient-to-br from-white via-blue-50 to-purple-100 p-20 z-0 "
      >
        <h2 className="text-4xl font-bold text-center mb-6">Features</h2>
        <p className="max-w-2xl mx-auto text-center text-gray-600">
          Awesome tools to manage your social presence.
        </p>
        <Features />
      </section>

      {/* Middle Section */}
      <section id="middle" className="h-screen bg-purple-50 p-20 z-0">
        <h2 className="text-4xl font-bold text-center mb-6">Why Choose Us</h2>
        <p className="max-w-2xl mx-auto text-center text-gray-600">
          Smart automation and intelligent insights that simplify your workflow.
        </p>
      </section>

      {/* End Section */}
      <section id="end" className="h-screen bg-purple-100 p-20 z-0">
        <h2 className="text-4xl font-bold text-center mb-6">Get Started</h2>
        <p className="max-w-2xl mx-auto text-center text-gray-600">
          Sign up and experience the future of social media management.
        </p>
      </section>
    </div>
  );
};

export default Hero;
