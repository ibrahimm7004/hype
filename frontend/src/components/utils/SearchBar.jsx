import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ searchBy, data, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(data);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false); // Start with the dropdown closed

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(data);
    } else {
      const filtered = data.filter((item) =>
        item[searchBy]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, data, searchBy]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1); // Reset highlighted index on change
    setShowDropdown(true); // Show dropdown when typing
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  const handleSelect = (option) => {
    setSearchTerm(option[searchBy].toString());
    setShowDropdown(false); // Close dropdown after selection
    setHighlightedIndex(-1);
    onSelect(option); // Call onSelect callback with the selected option
  };

  const handleBlur = () => {
    // Close dropdown after a delay to allow click event to register
    setTimeout(() => setShowDropdown(false), 200);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setSearchTerm(""); // Reset search term when toggling dropdown
  };

  return (
    <div className="relative w-full text-black">
      <div className="flex border-[2px] text-txt-white rounded-md px-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded-md bg-transparent text-txt-white outline-none border-0 w-full"
          placeholder={`Search by ${searchBy}`}
          onFocus={() => setShowDropdown(true)} // Show dropdown on focus
          onBlur={handleBlur}
        />
        <button onClick={toggleDropdown} className="pl-2 text-sm">
          <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
        </button>
      </div>
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
          {filteredOptions.map((option, index) => (
            <li
              key={option.id}
              className={`p-2 transition duration-300 cursor-pointer ${
                highlightedIndex === index ? "bg-gray-200 translate-x-2" : ""
              }`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option[searchBy]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
