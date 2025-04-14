import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    { src: "/images_mdx/Lab.png", alt: "CCC Labs", label: "CCC Labs" },
    { src: "/images_mdx/Lab.png", alt: "CCC Office", label: "CCC Office" },
    { src: "/images_mdx/Lab.png", alt: "CCC Office", label: "CCC Office" }
  ];

  const handleImageClick = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center p-2 bg-white max-w-[1280px] mx-auto">
      {/* Left Text Block */}
      <div className="w-full md:w-[35%] flex flex-col gap-6 mb-8 md:mb-0">
        <h1 className="text-[2.8rem] sm:text-[100px] md:text-[4.3rem] font-extrabold leading-[1.5] text-[#0D1C44]">
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
          className="mt-3 inline-flex items-center gap-2 w-fit px-8 py-3 bg-[#0D1C44] text-white text-md font-semibold rounded-full hover:bg-[#1c2e6d] transition-colors duration-300"
        >
          REPORT PROBLEM
          <span className="text-base ">→</span>
        </Link>
      </div>

      {/* Right Side Cards */}
      <div className="w-full mt-3 md:w-[70%] flex gap-[38px]">
        {images.map((image, index) => {
          const isActive = activeImage === index;
          return (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
                isActive ? "w-[60%]" : "w-[15%]"
              }`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-[30rem] w-full object-cover rounded-lg"
              />

              {/* Label overlay for active */}
              <div 
                className={`absolute inset-0 flex items-end transition-all duration-700 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="absolute bottom-12 left-12 text-xl text-white font-bold transition-all duration-700 ease-in-out">
                  {image.label}
                </p>
              </div>

              {/* Vertical text for collapsed */}
              <div 
                className={`absolute inset-0 flex items-end justify-center transition-all duration-700 ease-in-out ${
                  !isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p 
                  className="text-xl text-white font-bold transform -rotate-90 mb-24 transition-all duration-700 ease-in-out"
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
