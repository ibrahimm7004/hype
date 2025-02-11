import React from "react";

const MidSection = () => {
  return (
    <div className="my-20">
      <h1 className="text-center text-3xl ">How it works</h1>
      {/* container  */}
      <div className="flex justify-between items-center mx-16">
        {/* text content  */}
        <div>
          <p>Authorize your Social Account</p>
        </div>

        {/* image content  */}
        <div>
          <img
            src="./abstract-lines.png"
            className="rounded-lg shadow-lg w-32"
          />
          <div className="w-32 bg-cyan-100 rounded-lg shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default MidSection;
