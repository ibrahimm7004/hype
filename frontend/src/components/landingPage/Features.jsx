import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "SocialMedia Integration",
    description:
      "Schedule and post across all major social platforms effortlessly with a single click.",
    img: "/landingpage/flat-illustration-summertime-season_23-2150320849.jpg",
  },
  {
    title: "AI-Powered Meme",
    description:
      "Generate captions, posts, and viral memes instantly using cutting-edge AI tools.",
    img: "/landingpage/worst-meme-ever-comic-book-guy.jpeg",
  },
  {
    title: "Campaign Management",
    description:
      "Manage all your marketing campaigns in one place with real-time insights and analytics.",
    img: "/landingpage/images.png",
  },
];

const Features = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        x: 100, // <-- move from 100px right
        opacity: 0, // optional: fade in nicely
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  //   const ctx = gsap.context(() => {
  //     gsap.from(cardsRef.current, {
  //       x: -100,

  //       duration: 1.2,
  //       ease: "power3.out",
  //       stagger: 0.3,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 85%",
  //       },
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-50 py-24 px-6 sm:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Elevate Your Content Game
        </h2>
        <p className="text-gray-500 text-lg">
          Powerful tools to create, automate, and scale your social media
          presence.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-10 space-y-10 md:space-y-0 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-3xl shadow-lg p-8 h-[460px] w-full hover:shadow-2xl transition-all duration-500"
          >
            <div
              className="w-full h-40 bg-cover bg-center rounded-2xl mb-6 shadow-sm"
              style={{ backgroundImage: `url(${feature.img})` }}
            ></div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-base">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
