import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const teamMembers = [
  {
    name: "Talha Imtiaz",
    role: "Web Dev & UI/UX Designer",
    email: "talha.imtiaz.dev@gmail.com",
    github: "https://github.com/talhaimtiaz09",
    linkedin: "https://www.linkedin.com/in/talha-imtiaz342/",
    image: "/developers/talha.jpeg",
  },
  {
    name: "Ibrahim Mehmood",
    role: "Data & API Architect",
    email: "ibrahim123@gmail.com",
    linkedin: "https://www.linkedin.com/in/ibrahim-zm/",
    github: "https://github.com/ibrahimm7004",
    image: "/developers/ibrahim.jpeg",
  },
  {
    name: "Sheryar Ahmed",
    role: "AI & Data Engineer",
    email: "sherry123@gmail.com",
    linkedin: "https://www.linkedin.com/in/sherry-ahmad/",
    github: "https://github.com/emsherry",
    image: "/developers/sherry.jpeg",
  },
];

const AboutPage = () => {
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      y: -40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Cards animation
    gsap.from(cardsRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.2,
      delay: 0.1,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6 py-16">
      {/* Header Section */}
      <div ref={headerRef} className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Hype Radar</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered social media marketing tool that lets you{" "}
          <span className="font-semibold">
            manage, schedule, and generate AI-driven posts
          </span>{" "}
          across multiple platforms — all from one dashboard.
        </p>
      </div>

      {/* Team Section */}
      <div className="mt-12 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-700 text-center">
          Meet the Developers
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Final Year Project by GIKI Students
        </p>

        {/* Cards */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white py-10 px-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 w-72 text-center"
            >
              {/* Profile Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mx-auto"
              />

              {/* Info */}
              <div className="mt-6 space-y-3">
                <div>
                  <h3 className="text-xl text-gray-700 font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-md text-slate-600 font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 pt-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-xl text-blue-600 hover:text-blue-700 transition duration-300" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="text-xl text-gray-800 hover:text-gray-900 transition duration-300" />
                    </a>
                  )}
                  <a
                    href={`mailto:${member.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEnvelope className="text-xl text-slate-600 hover:text-red-700 transition duration-300" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
