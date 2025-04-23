import React, { useState } from "react";
import { FaFacebook, FaCheckCircle } from "react-icons/fa";

const FacebookPageSelector = ({ pages, selectedPage, setSelectedPage }) => {
  const handleSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100 mt-10">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        <FaFacebook className="text-blue-600 text-3xl" />
        Select a Facebook Page
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => handleSelect(page)}
            className={`cursor-pointer p-5 rounded-xl border transition shadow-sm hover:shadow-md hover:border-blue-500 ${
              selectedPage?.id === page.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium text-gray-800">
                {page.name}
              </div>
              {selectedPage?.id === page.id && (
                <FaCheckCircle className="text-green-500 text-xl" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {page.id}</p>

            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {page.category}
              </p>

              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Permissions:
                </span>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {page.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPage && (
        <div className="mt-4 p-4 border-t text-sm text-gray-700">
          Selected Page ID:{" "}
          <span className="font-medium">{selectedPage.id}</span>
        </div>
      )}
    </div>
  );
};

export default FacebookPageSelector;
