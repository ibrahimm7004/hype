import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Unified Dashboard",
    description:
      "Manage all your social accounts from one place with clarity and control.",
  },
  {
    title: "AI Scheduling",
    description:
      "Automate your posts for the best times, powered by engagement prediction.",
  },
  {
    title: "Smart Analytics",
    description:
      "Track performance across platforms with real-time visual reports.",
  },
];

const LandingPage = () => {
  const heroRef = useRef(null);
  const featureRefs = useRef([]);

  useEffect(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.3,
      ease: "power3.out",
    });

    featureRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-slate-100 text-gray-800 font-sans">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="max-w-7xl mx-auto px-6 pt-28 pb-20 text-center"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Take Control of <span className="text-orange-600">Your Socials</span>
          <br /> in One Smart Platform
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Plan, publish, and track across all your accounts — faster, smarter,
          and beautifully.
        </p>
        <button className="bg-orange-600 hover:bg-orange-700 transition text-white text-lg px-6 py-3 rounded-xl shadow-md font-medium">
          Get Started Free
        </button>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              ref={(el) => (featureRefs.current[i] = el)}
              className="bg-slate-50 hover:bg-slate-100 transition p-6 rounded-2xl shadow-lg border-t-4 border-orange-500"
            >
              <h3 className="text-xl font-bold mb-2 text-orange-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Grow Your Brand Smarter
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-6">
          Join 10,000+ creators and businesses managing content the easy way.
        </p>
        <button className="bg-white text-orange-600 hover:bg-slate-100 transition text-lg px-6 py-3 rounded-xl shadow font-semibold">
          Create Your Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} SocialPilot. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
