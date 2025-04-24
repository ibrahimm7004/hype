import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaChartLine,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRocket />,
    title: "Effortless Posting",
    description: "Schedule and publish to all platforms in a single click.",
  },
  {
    icon: <FaChartLine />,
    title: "Analytics Insights",
    description: "Track performance and engagement in real-time.",
  },
  {
    icon: <FaFacebookF />,
    title: "Facebook Integration",
    description: "Connect and manage Facebook pages seamlessly.",
  },
  {
    icon: <FaInstagram />,
    title: "Instagram Ready",
    description: "Link Instagram accounts for direct media publishing.",
  },
];

const Dashboard = () => {
  return (
    <div className="p-8">
      <motion.div
        className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-blue-900 mb-3">
          Welcome to Hype Radar 🎯
        </h1>
        <p className="text-blue-700 max-w-xl mx-auto">
          Your one-stop solution for social media management — post, analyze,
          and optimize all in one dashboard.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl text-blue-600">{feature.icon}</div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
