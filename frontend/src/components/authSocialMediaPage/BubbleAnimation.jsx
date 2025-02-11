import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
export default function BubbleAnimation() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Math.random(),
          size: Math.floor(Math.random() * 40) + 20, // Random size between 20-60px
          left: Math.random() * 100, // Random left position
        },
      ]);
    }, 500); // Create a bubble every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-900 flex items-center justify-center">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-blue-300 bg-opacity-50 rounded-full"
          style={{
            width: bubble.size + "px",
            height: bubble.size + "px",
            left: bubble.left + "%",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -500 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "ease-out" }}
          onAnimationComplete={() =>
            setBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
          }
        />
      ))}
    </div>
  );
}
