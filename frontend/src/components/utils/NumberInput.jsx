import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NumberInput = ({
  min = 0,
  max = 1000000,
  step = 1,
  initialValue = undefined,
  placeholder = "",
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
    <div className="flex gap-x-2 items-center">
      {/* Number Input */}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(Number(e.target.value))}
        className=" text-center border rounded w-64 px-2 py-2 text-slate-800"
      />
      {/* Minus Button */}
      <button
        onClick={decrement}
        className="bg-slate-400 hover:bg-red-500 text-xl text-black py-1 px-2 rounded"
        disabled={value <= min} // Disable button if at min value
      >
        <FontAwesomeIcon icon="fa-solid fa-minus" />
      </button>

      {/* Plus Button */}
      <button
        onClick={increment}
        className="bg-slate-300 hover:bg-green-500 text-xl text-black py-1 px-2 rounded"
        disabled={value >= max} // Disable button if at max value
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </button>
    </div>
  );
};

export default NumberInput;
