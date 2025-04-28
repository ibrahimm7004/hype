"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Features from "../components/landingPage/Features";
import Hero from "../components/landingPage/hero/Hero";
import FAQ from "../components/landingPage/FAQ";
import GetStarted from "../components/landingPage/GetStarted";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // On-load animation
      tl.from(titleRef.current, { y: 50, opacity: 0, duration: 1 }).from(
        subtitleRef.current,
        { y: 30, opacity: 0, duration: 1 },
        "-=0.5"
      );

      // Parallax effect for the image during Features section
      gsap.to(imgRef.current, {
        x: "-40vw",
        scale: 0.5,
        scrollTrigger: {
          trigger: "#features",
          start: "top bottom",
          end: "bottom top", // STOP when features section ends
          scrub: 1,
          markers: false,
        },
      });

      // Pin the image when Features section ends
      ScrollTrigger.create({
        trigger: "#features",
        start: "bottom bottom", // when bottom of #features hits bottom of viewport
        end: "bottom top", // until features section scrolls out
        pin: imgRef.current,
        pinSpacing: false,
        scrub: true,
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-hidden">
      {/* Floating LandingPage Image Container */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full pointer-events-none z-40">
        <img
          ref={imgRef}
          src="/hero-img.png"
          alt="LandingPage"
          className="w-3/5 max-w-3xl mx-auto"
        />
      </div>

      {/* Hero Section */}
      <Hero titleRef={titleRef} subtitleRef={subtitleRef} imgRef={imgRef} />

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 relative z-10"
      >
        <Features />
      </section>

      {/* FAQ Section */}
      <section id="middle" className="min-h-screen bg-purple-50 relative z-10">
        <FAQ />
      </section>

      {/* GetStarted Section */}
      <section id="end" className="min-h-screen bg-purple-100 relative z-10">
        <GetStarted />
      </section>
    </div>
  );
};

export default LandingPage;
