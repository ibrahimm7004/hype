import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const teamMembers = [
  {
    name: "Talha Imtiaz",
    role: "Web Dev & UI/UX Designer",
    email: "talha.imtiaz.dev@gmail.com",
    github: "https://github.com/talhaimtiaz09",
    linkedin: "https://www.linkedin.com/in/talha-imtiaz342/",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQE8lqWNvxDHZg/profile-displayphoto-shrink_200_200/B4DZSZg4M3G8AY-/0/1737742320965?e=1744848000&v=beta&t=uQ2I8GGyFek9dH1qX9dlOXvoz6NH9rM_WkoeD7dza4M", // Replace with actual image URL
  },
  {
    name: "Ibrahim Mehmood",
    role: "Data & API Architect",
    email: "ibrahim123@gmail.com",
    linkedin: "https://www.linkedin.com/in/ibrahim-zm/",
    github: "https://github.com/ibrahimm7004",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHbK5dQx7VmuA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1708726029165?e=1744848000&v=beta&t=ZgTLCHTlDmFJR9aF9KQCB51aKW9dvOplKvaAdZIPQFY", // Replace with actual image URL
  },
  {
    name: "Sheryar Ahmed",
    role: "AI & Data Engineer",
    email: "sherry123@gmail.com",
    linkedin: "https://www.linkedin.com/in/sherry-ahmad/",
    github: "https://github.com/emsherry",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFQxi_BhCRN8w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1712522465303?e=1744848000&v=beta&t=qbKHzukp_8Aa7ORxbZqrZhcu7wyx9U_HTbe7ehKVvl8", // Replace with actual image URL
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6 py-16">
      {/* Header Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-800">Hype Radar</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered social media marketing tool that lets you{" "}
          <span className="font-semibold">
            manage, schedule, and generate AI-driven posts
          </span>
          across multiple platforms — all from one dashboard.
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="mt-12 w-full max-w-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-700 text-center">
          Meet the Developers
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Final Year Project by GIKI Students
        </p>

        {/* Horizontal Row of Vertical Cards */}
        <div className="mt-12 flex justify-center gap-8 ">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white py-10 rounded-lg border-[1px] border-gray-200 flex flex-col items-center w-72 transition-all "
              //   whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover "
              />

              {/* Member Info */}
              <div className="mt-6 text-center space-y-3">
                <div className="py-4">
                  <h3 className="text-xl text-gray-700 font-medium">
                    {member.name}
                  </h3>
                  <p className="text-md text-slate-600 font-medium w-2/3 mx-auto">
                    {member.role}
                  </p>
                </div>
                {/* <p className="text-sm text-gray-500">{member.email}</p> */}

                {/* Social Links */}
                <div className="mt-4 flex justify-center gap-4">
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
