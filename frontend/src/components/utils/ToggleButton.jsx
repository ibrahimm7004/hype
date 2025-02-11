import React, { useState } from "react";

const ToggleButton = ({ value, onClick }) => {
  const [isToggled, setIsToggled] = useState(value);

  const handleToggle = () => {
    const toggleValue = isToggled;
    if (onClick) {
      onClick(!toggleValue);
    }
    setIsToggled(!toggleValue);

    console.log("isToggled", isToggled);
    console.log("prop value", value);
  };

  return (
    <div
      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer p-[4px] ${
        isToggled ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={handleToggle}
    >
      <span
        className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
          isToggled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleButton;
