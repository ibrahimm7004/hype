import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ImageCarousel = ({ imageUrls, setSelectedImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedViewImage, setSelectedViewImage] = useState(null);

  const prevImage = () => {
    let index = currentIndex - 1;
    if (index < 0) index = imgUrls.length - 1;
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    setSelectedImage(imageUrls[index]);
  };

  const nextImage = () => {
    let index = (currentIndex + +1) % imageUrls.length;
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    setSelectedImage(imageUrls[index]);
  };

  return (
    <div className="relative w-fit  mx-autom ">
      {/* Image Container */}
      <div className="overflow-hidden rounded-lg shadow-sm h-[600px] flex items-center justify-center relative bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={imageUrls[currentIndex]}
            src={imageUrls[currentIndex]}
            alt={`Meme ${currentIndex + 1}`}
            className="w-[400px] object-cover rounded-sm my-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.1 }}
          />
        </AnimatePresence>
      </div>

      {/* Expand Icon */}
      <FontAwesomeIcon
        icon={"fa-expand"}
        size="lg "
        className="absolute right-0 bottom-0 text-white bg-gray-400 p-2 rounded-md cursor-pointer hover:bg-gray-600 transition"
        onClick={() => setSelectedViewImage(imageUrls[currentIndex])}
      />

      {/* Progress Dots */}
      <div className="flex justify-center mt-3 gap-x-4">
        {/* Navigation Buttons */}
        <button
          className=" bg-gray-400 text-white p-2 rounded-md hover:bg-gray-600 transition"
          onClick={prevImage}
        >
          <FaChevronLeft />
        </button>
        <div className="flex justify-center mt-3">
          {imageUrls.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full transition ${
                index === currentIndex ? "bg-gray-800 scale-125" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
        <button
          className=" bg-gray-400 text-white p-2 rounded-md hover:bg-gray-600 transition"
          onClick={nextImage}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Modal for Expanded View */}
      {selectedViewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setSelectedViewImage(null)}
        >
          <motion.img
            src={selectedViewImage}
            className="max-w-full max-h-full rounded-xl shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
