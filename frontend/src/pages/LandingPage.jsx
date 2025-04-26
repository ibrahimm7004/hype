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

      // Parallax effect for the image
      gsap.to(imgRef.current, {
        x: "50vw", // Move the image left and right
        scale: 0.8, // Reduce the width of the image
        scrollTrigger: {
          trigger: "#features", // Start from the Features section
          start: "top bottom", // Trigger when the section is about to enter the viewport
          end: "bottom top", // Trigger end when the section is leaving the viewport
          scrub: 1, // Smooth scroll-based animation
          markers: false, // Optional: Add markers to visualize the scroll trigger
        },
      });

      // Image animation triggered after the Hero Section
      gsap.to(imgRef.current, {
        scale: 0.6, // Reduce the image size after the Hero section
        scrollTrigger: {
          trigger: "#middle", // Start from the FAQ section
          start: "top center", // Trigger when the section enters the center of the viewport
          end: "bottom top", // End animation as it scrolls out
          scrub: 1, // Smooth animation
          markers: false, // Optional: Add markers for debugging
        },
      });

      // Parallax effect for img movement left to right for each section
      gsap.to(imgRef.current, {
        x: "30vw", // Adjust movement based on section scroll
        scrollTrigger: {
          trigger: "#middle", // Trigger the effect at the FAQ section
          start: "top bottom", // Trigger when FAQ section enters the viewport
          end: "bottom top", // End when FAQ section leaves
          scrub: 1,
        },
      });

      gsap.to(imgRef.current, {
        x: "-30vw", // Move in the opposite direction at the end of the page
        scrollTrigger: {
          trigger: "#end", // Trigger when the last section is in view
          start: "top bottom", // Trigger when the section is about to enter the viewport
          end: "bottom top", // End when it leaves the viewport
          scrub: 1, // Smooth scroll animation
        },
      });
    });

    // Always refresh ScrollTrigger after DOM changes
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-x-hidden overflow-y-hidden">
      {/* Floating LandingPage Image */}

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
