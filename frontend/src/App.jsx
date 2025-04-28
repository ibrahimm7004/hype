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
import TwitterCallback from "./components/SocialPlatformPage/TwitterCallback";
import TwitterProfile from "./components/SocialPlatformPage/TwitterProfile";
import TwitterCreatePost from "./components/SocialPlatformPage/TwitterCreatePost";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AiMarketing from "./pages/AiMarketing";
import Anlytics from "./pages/Anlytics";
import MemeTextGenPage from "./pages/MemeTextGenPage";
import SchedulePost from "./pages/SchedulePost";
import RedditProfile from "./components/SocialPlatformPage/RedditProfile";
import SocialProfiles from "./components/SocialPlatformPage/SocialProfiles";
import CreatPost from "./components/SocialPlatformPage/CreatPost";
import RedditCallback from "./components/SocialPlatformPage/RedditCallback";

import UserFacebookPageList from "./components/meta/facebook/UserFacebookPageList";
import SaveInstagramId from "./components/meta/instagram/SaveInstagramId";
import FacebookCallback from "./components/SocialPlatformPage/FacebookCallback";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      <Route path="meta"></Route>
      {/* Authentication and Dashboard Routes */}
      <Route path="/social-platform" element={<DashboardLayout />}>
        <Route path="manage">
          <Route path="facebook" element={<UserFacebookPageList />} />
          <Route path="instagram" element={<SaveInstagramId />} />
        </Route>
        <Route path="profiles" element={<SocialProfiles />} />
        <Route path="create-post" element={<CreatPost />} />
        <Route index element={<SocialMediaAuthPage />} />
        <Route path="callback">
          <Route path="facebook" element={<FacebookCallback />} />
          <Route path="twitter" element={<TwitterCallback />} />
          <Route path="reddit" element={<RedditCallback />} />
        </Route>
        <Route path="twitter">
          <Route path="" element={<TwitterProfile />} />

          <Route path="schedule-post" element={<SchedulePost />} />
          <Route path="analytics" element={<Anlytics />} />
          <Route path="post" element={<TwitterCreatePost />} />

          <Route path="ai-marketing">
            {/* <Route path="" element={<AiMarketing />} /> */}

            <Route path="memeText" element={<MemeTextGenPage />} />
            <Route path="memeImage" element={<MemeImgGenPage />} />
          </Route>
        </Route>

        <Route path="reddit">
          <Route path="" element={<RedditProfile />} />
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
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
library.add(fab, fas, far);
