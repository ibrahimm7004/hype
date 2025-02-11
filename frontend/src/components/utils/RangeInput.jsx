import React, { useState } from "react";

const RangeInput = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue) => {
    // Ensure the new value stays within the min and max bounds
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setValue(clampedValue);

    // Call the onChange callback if provided
    if (onChange) {
      onChange(clampedValue);
    }
  };

  const increment = () => handleChange(value + step);
  const decrement = () => handleChange(value - step);

  return (
    <div className="flex items-center">
      {/* Minus Button */}
      <button
        onClick={decrement}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-l"
      >
        -
      </button>

      {/* Range Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="mx-2"
      />

      {/* Plus Button */}
      <button
        onClick={increment}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-r"
      >
        +
      </button>
    </div>
  );
};

export default RangeInput;
