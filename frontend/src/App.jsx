import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import MemeImgGenPage from "./pages/MemeImgGenPage";
import SocialMediaAuthPage from "./pages/SocialMediaAuthPage";
import UserAccountPage from "./pages/UserAccountPage";
import UserRegister from "./components/userAccoutPage/UserRegister";
import UserLogin from "./components/userAccoutPage/UserLogin";
import UserProfile from "./components/userAccoutPage/UserProfile";
import TwitterCallback from "./components/authSocialMediaPage/TwitterCallback";
import TwitterProfile from "./components/authSocialMediaPage/TwitterProfile";
import TwitterCreatePost from "./components/authSocialMediaPage/TwitterCreatePost";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AiMarketing from "./pages/AiMarketing";
import Anlytics from "./pages/Anlytics";
import MemeTextGenPage from "./pages/MemeTextGenPage";
import SchedulePost from "./pages/SchedulePost";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication and Dashboard Routes */}
      <Route path="/social-platform" element={<DashboardLayout />}>
        <Route index element={<SocialMediaAuthPage />} />
        <Route path="callback" element={<TwitterCallback />} />
        <Route path="twitter">
          <Route path="" element={<TwitterProfile />} />

          <Route path="schedule-post" element={<SchedulePost />} />
          <Route path="analytics" element={<Anlytics />} />
          <Route path="post" element={<TwitterCreatePost />} />

          <Route path="ai-marketing">
            <Route path="" element={<AiMarketing />} />
            <Route path="memeText" element={<MemeTextGenPage />} />
            <Route path="memeImage" element={<MemeImgGenPage />} />
          </Route>
        </Route>
      </Route>

      {/* User Account Routes */}
      <Route path="/user">
        <Route path="register" element={<UserRegister />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Static Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
library.add(fab, fas, far);
