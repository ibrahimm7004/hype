import React from "react";
import DashSidebar from "./DashSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* DashSidebar */}
      <DashSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
