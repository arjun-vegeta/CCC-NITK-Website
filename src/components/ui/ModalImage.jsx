import React, { useState } from "react";


const ModalImage = ({ src, alt = "", width = "600px", height = "400px" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="rounded-md cursor-zoom-in"
        style={{ width, height }}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg cursor-zoom-out transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ModalImage;
