import React from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <motion.div
        className="text-center p-10 bg-white rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Hype Radar 🎯
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all your social media marketing in one place.
        </p>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
