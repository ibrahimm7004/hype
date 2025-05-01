import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GetStarted = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(buttonRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col justify-center items-center text-center p-8"
    >
      <h1
        ref={textRef}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Ready to Get Started with{" "}
        <span className="text-purple-400">Hyperadar</span>?
      </h1>
      <p className="text-gray-300 max-w-2xl mb-8 text-lg">
        Hyper-charge your business intelligence with Hyperadar’s powerful radar
        technology. Get real-time insights faster than ever.
      </p>
      <button
        ref={buttonRef}
        onClick={() => (window.location = "/user/register")}
        className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-lg font-semibold transition-all shadow-lg"
      >
        Get Started
      </button>
    </section>
  );
};

export default GetStarted;
