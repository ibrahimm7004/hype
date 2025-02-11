import React from "react";
import { motion } from "framer-motion";
import NeonRectangle from "./NeonReatangle";

const HeroMedia = () => {
  const imgStyle = "w-1/3 h-[400px] overflow-hidden rounded-md shadow-lg";
  return (
    <div className="flex gap-x-4 justify-center items-center w-2/3 mx-auto">
      <div className={imgStyle}>
        <img
          src="https://cdn.pixabay.com/photo/2023/11/01/22/11/color-splash-8359411_1280.jpg"
          alt=""
        />
      </div>
      {/* interactive content */}
      <div className="w-1/3">
        <div className=" bg-gray-100 p-16 text-sm rounded-lg flex flex-col justify-between items-center">
          <div className="flex justify-between font-semibold w-full">
            <p>marketing tool</p>
            <p>Ai Generations</p>
          </div>
          <img
            className="w-32"
            src="https://png.pngtree.com/png-clipart/20240308/original/pngtree-abstract-gradient-blur-shape-png-image_14537953.png"
            alt=""
          />
          <div className="flex justify-between font-semibold w-full">
            <p>automation</p>
            <p>Social Auth</p>
          </div>
        </div>
        {/* <NeonRectangle /> */}
      </div>
      <div className={imgStyle}>
        <img
          src="https://cdn.pixabay.com/photo/2023/08/01/15/30/ai-generated-8163239_640.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroMedia;
