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
        className="text-red-400 font-medium text-sm tracking-wide"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        ⏳ Time Expired!
      </motion.p>
    );
  }

  return (
    <motion.div
      className="flex items-center space-x-2 bg-gray-700 text-white px-3 py-1 rounded-md shadow-sm border-[1px] border-gray-300 w-[180px]"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TimeBox value={timeLeft.days} label="D" />
      <TimeBox value={timeLeft.hours} label="H" />
      <TimeBox value={timeLeft.minutes} label="M" />
      <TimeBox
        value={timeLeft.seconds}
        label="S"
        isLastSeconds={timeLeft.total < 10000}
      />
    </motion.div>
  );
};
const TimeBox = ({ value, label }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-2"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <span className="text-md font-semibold text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-white">
        {label}
      </span>
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
