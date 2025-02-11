import React from "react";
import { motion } from "framer-motion";
import HeroTextContent from "../components/landingPage/hero/HeroTextContent";
import HeroMedia from "../components/landingPage/hero/HeroMedia";
import MidSection from "../components/landingPage/mid/MidSection";

const LandingPage = () => {
  return (
    <div>
      <HeroTextContent />
      <HeroMedia />
      <MidSection />
    </div>
  );
};

export default LandingPage;
