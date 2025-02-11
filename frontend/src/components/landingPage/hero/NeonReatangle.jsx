import { motion } from "framer-motion";
import React from "react";

const NeonRectangle = ({
  width = "200px",
  height = "100px",
  color = "#00ffcc",
}) => {
  return (
    <div clas>
      <div
        className="relative flex items-center justify-center "
        style={{ width, height }}
      >
        {/* Main Rectangle */}
        <div
          className="absolute bg-black border-2 shadow-lg"
          style={{ width: "100%", height: "100%", borderColor: color }}
        ></div>

        {/* Rotating Neon Outline */}
        <motion.div
          className="absolute w-full h-full border-2"
          style={{ borderColor: color, filter: "blur(4px)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default NeonRectangle;
