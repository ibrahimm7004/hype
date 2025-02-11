import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageCarousel from "./ImageCarousel";
import { Twitter, Clock, RefreshCcw, MessageCircle } from "lucide-react";

const ImageGallery = ({ imageUrls, setInterfaceState }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!imageUrls || imageUrls.length === 0) {
    return <p className="text-center text-gray-500">No images available</p>;
  }

  const postOptions = [
    {
      label: "Auto Post",
      descritption:
        "Post this image to your Twitter account without any hassle.",
      icon: <Twitter className="w-6 h-6 text-[#1DA1F2]" />,
      action: () => alert("Posting now..."),
      cta: "Post Now",
    },
    {
      label: "Schedule",
      descritption: "Schedule this image to be posted at a later time.",
      icon: <Clock className="w-6 h-6 text-gray-500" />,
      action: () => alert("Scheduling..."),
      cta: "Schedule",
    },
    {
      label: "Re-Enter Prompt",
      descritption: "You can re-enter the prompt to generate a new image.",
      icon: <RefreshCcw className="w-6 h-6 text-green-500" />,
      action: () => setInterfaceState("textPrompt"),
      cta: "Edit Prompt",
    },
    {
      label: "Feedback",
      descritption: "You don't like the image? Give us feedback.",
      icon: <MessageCircle className="w-6 h-6 text-red-500" />,
      action: () => alert("Feedback form..."),
      cta: "Give Feedback",
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-6">
      {/* Image Grid and Post Options */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl space-y-6 md:space-y-0 md:space-x-8">
        {/* Options Panel */}
        <motion.div
          className="flex flex-col w-full space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {postOptions.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-6 bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg transition-all border-l-4 border-[#1DA1F2] w-full"
              onClick={option.action}
            >
              <div className="mr-4">{option.icon}</div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="font-light w-1/2">{option.descritption}</p>
              </div>
              {/* <motion.button
                className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition"
                whileHover={{ scale: 1.05 }}
              >
                {option.cta}
              </motion.button> */}
            </motion.div>
          ))}
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageCarousel
            imageUrls={imageUrls}
            setSelectedImage={setSelectedImage}
          />
        </motion.div>
      </div>

      {/* Modal for Viewing Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative p-4 bg-white rounded-lg shadow-lg max-w-3xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedImage(null)}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
