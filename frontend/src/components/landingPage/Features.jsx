import React, { useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaRedditAlien,
  FaTwitter,
  FaMagic,
  FaClock,
  FaRobot,
  FaRocket,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "All Social Platforms",
    description: "Connect Facebook, Instagram, Reddit, Twitter.",
    icon: <FaFacebookF />,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Post Everywhere",
    description: "One-click publishing across platforms.",
    icon: <FaRocket />,
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Schedule Posts",
    description: "Smart planning for maximum engagement.",
    icon: <FaClock />,
    color: "from-green-400 to-green-600",
  },
  {
    title: "AI Meme Generator",
    description: "Create viral memes instantly.",
    icon: <FaMagic />,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    title: "AI Text Writer",
    description: "Generate captions and posts with AI.",
    icon: <FaRobot />,
    color: "from-pink-400 to-pink-600",
  },
  {
    title: "Analytics Insights",
    description: "Unlock data-driven strategies.",
    icon: <FaTwitter />,
    color: "from-teal-400 to-teal-600",
  },
];

const Features = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-20 px-6 sm:px-12 lg:px-24 overflow-hidden"
    >
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-indigo-200 to-indigo-400 opacity-30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-teal-200 to-teal-400 opacity-30 rounded-full filter blur-3xl animate-pulse"></div>

      <div className="max-w-3xl mx-auto text-center mb-16 z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          Supercharge Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Content Strategy
          </span>
        </h2>
        <p className="mt-4 text-gray-600 text-base sm:text-lg">
          Harness the power of AI-driven tools to create, schedule, and analyze
          like a pro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10">
        {features.map((feature, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
          >
            <div
              className={`p-5 rounded-full bg-gradient-to-tr ${feature.color} text-white text-3xl shadow-lg`}
            >
              {feature.icon}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-500 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
