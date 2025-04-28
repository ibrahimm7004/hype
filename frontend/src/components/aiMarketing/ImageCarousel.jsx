import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faExpand,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ImageCarousel = ({ imageUrls, setSelectedImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedViewImage, setSelectedViewImage] = useState(null);
  const imageRef = useRef(null);
  const expandedImageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentIndex]);

  const prevImage = () => {
    const index = currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(index);
    setSelectedImage(imageUrls[index]);
  };

  const nextImage = () => {
    const index = (currentIndex + 1) % imageUrls.length;
    setCurrentIndex(index);
    setSelectedImage(imageUrls[index]);
  };

  const handleExpand = () => {
    setSelectedViewImage(imageUrls[currentIndex]);
    setTimeout(() => {
      if (expandedImageRef.current) {
        gsap.fromTo(
          expandedImageRef.current,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    }, 50);
  };

  const handleCloseExpand = () => {
    if (expandedImageRef.current) {
      gsap.to(expandedImageRef.current, {
        scale: 0.7,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setSelectedViewImage(null),
      });
    } else {
      setSelectedViewImage(null);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Image Container */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md bg-gray-100 h-[500px] flex items-center justify-center relative">
        <img
          ref={imageRef}
          src={imageUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="object-contain h-full max-w-full"
        />

        {/* Expand Button */}
        <button
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          onClick={handleExpand}
        >
          <FontAwesomeIcon icon={faExpand} className="text-gray-600" />
        </button>
      </div>

      {/* Controls and Dots */}
      <div className="flex items-center justify-between mt-4">
        {/* Prev Button */}
        <button
          className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
          onClick={prevImage}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
        </button>

        {/* Dots */}
        <div className="flex space-x-2">
          {imageUrls.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
          onClick={nextImage}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
        </button>
      </div>

      {/* Fullscreen Expanded Modal */}
      {selectedViewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={handleCloseExpand}
        >
          <div className="relative">
            <img
              ref={expandedImageRef}
              src={selectedViewImage}
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg cursor-pointer"
              alt="Expanded View"
            />
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              onClick={handleCloseExpand}
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
