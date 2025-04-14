import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // State to track which image is currently active (0 is the first image)
  const [activeImage, setActiveImage] = useState(0);

  // Image data to make the code cleaner
  const images = [
    { src: "/images_mdx/Lab.png", alt: "CCC Labs", label: "CCC Labs" },
    { src: "/images_mdx/Lab.png", alt: "CCC Office", label: "CCC Office" },
    { src: "/images_mdx/Lab.png", alt: "CCC Office", label: "CCC Office" }
  ];

  // Handle image click to change active state
  const handleImageClick = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center p-2 bg-white max-w-[1280px] mx-auto">
      {/* Left Text Block (30% on desktop, full on mobile) */}
      <div className="w-full md:w-[30%] flex flex-col gap-6 mb-8 md:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[#0D1C44]">
          CENTRAL <br />
          COMPUTER <br />
          CENTRE
        </h1>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/network-guides"
            className="px-8 py-2 border-2 border-[#0D1C44] text-[#0D1C44] rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white transition-colors duration-300"
          >
            VIEW GUIDES
          </Link>
          <Link
            to="/facilities"
            className="px-8 py-2 border-2 border-[#0D1C44] text-[#0D1C44] rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white transition-colors duration-300"
          >
            FACILITIES
          </Link>
        </div>

        <Link
          to="/report-problem"
          className="inline-flex items-center gap-2 w-fit px-8 py-2 bg-[#0D1C44] text-white text-md font-semibold rounded-full hover:bg-[#1c2e6d] transition-colors duration-300"
        >
          REPORT PROBLEM
          <span className="text-base">→</span>
        </Link>
      </div>

      {/* Right Side Cards (70% on desktop, full on mobile) */}
      <div className="w-full md:w-[70%] flex gap-4">
        {images.map((image, index) => {
          const isActive = activeImage === index;
          return (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
                isActive ? "w-[60%]" : "w-[20%]"
              }`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-96 w-full object-cover rounded-lg"
              />
              
              {/* Label container with smooth transition */}
              <div 
                className={`absolute inset-0 flex items-end transition-all duration-700 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="absolute bottom-4 left-4 text-lg text-white font-medium transition-all duration-700 ease-in-out">
                  {image.label}
                </p>
              </div>
              
              {/* Vertical text for inactive images */}
              <div 
                className={`absolute inset-0 flex items-end justify-center transition-all duration-700 ease-in-out ${
                  !isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p 
                  className="text-lg text-white font-medium transform -rotate-90 mb-24 transition-all duration-700 ease-in-out"
                >
                  {image.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroSection;