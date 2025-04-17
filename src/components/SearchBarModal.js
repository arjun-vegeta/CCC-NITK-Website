// components/SearchbarModal.js
import React from "react";

const SearchbarModal = ({ display, closeSearch }) => {
  return (
    display && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-start pt-24 px-4">
        
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-gray-300 transition"
          onClick={closeSearch}
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-full shadow-lg p-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full text-lg px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FA444] dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    )
  );
};

export default SearchbarModal;
