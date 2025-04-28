import React from "react";
import DashSidebar from "./DashSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white text-gray-700">
      {/* Sidebar */}
      <DashSidebar />

      {/* Main Content Area */}
      <div className="flex-1 px-2 bg-white overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
