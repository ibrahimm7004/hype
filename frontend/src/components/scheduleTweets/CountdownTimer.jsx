import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

const CountdownTimer = ({ scheduledTime }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(scheduledTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(scheduledTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  if (timeLeft.total <= 0) {
    return (
      <motion.p
        className="text-red-500 font-semibold text-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        ⏳ Time Expired!
      </motion.p>
    );
  }

  return (
    <motion.div
      className="flex space-x-2 text-md font-semibold text-white bg-gray-900 p-3 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FlipNumber value={timeLeft.days} label="Days" />
      <FlipNumber value={timeLeft.hours} label="Hrs" />
      <FlipNumber value={timeLeft.minutes} label="Min" />
      <FlipNumber
        value={timeLeft.seconds}
        label="Sec"
        isLastSeconds={timeLeft.total < 10000}
      />
    </motion.div>
  );
};

const FlipNumber = ({ value, label, isLastSeconds }) => {
  return (
    <motion.div
      className={`flex flex-col items-center px-3 py-2 rounded-lg ${
        isLastSeconds ? "bg-red-500 animate-pulse" : "bg-gray-700"
      }`}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: [0, -90, 0] }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.span
        className="text-xl font-bold"
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
      <span className="text-xs text-gray-300">{label}</span>
    </motion.div>
  );
};

const getTimeLeft = (scheduledTime) => {
  const eventTime = new Date(scheduledTime).getTime();
  const now = new Date().getTime();
  const difference = eventTime - now;

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default CountdownTimer;
