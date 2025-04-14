import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    { src: "/hero/ccc.jpg", alt: "CCC Building", label: "CCC Building" },
    { src: "/images_mdx/Lab.png", alt: "CCC Labs", label: "CCC Labs" },
    { src: "/hero/dc.jpg", alt: "Data Centre", label: "Data Centre" }
  ];

  const handleImageClick = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center p-2 max-w-[1280px] mx-auto mt-6 font-Montserrat">
      {/* Left Text Block */}
      <div className="w-full md:w-[35%] flex flex-col gap-6 mb-8 md:mb-0">
        <h1 className="text-[2.8rem] sm:text-[100px] md:text-[4.0rem] font-black leading-[1.4] text-[#0D1C44]">
          CENTRAL <br />
          COMPUTER <br />
          CENTRE
        </h1>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/network-guides"
            className="px-9 py-3.5 border-2 border-[#0D1C44] text-[#0D1C44] rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white transition-colors duration-300"
          >
            VIEW GUIDES
          </Link>
          <Link
            to="/facilities"
            className="px-9 py-3.5 border-2 border-[#0D1C44] text-[#0D1C44] rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white transition-colors duration-300"
          >
            FACILITIES
          </Link>
        </div>

        <Link
          to="/report-problem"
          className="mt-3 inline-flex items-center gap-2 w-fit px-9 py-[16px] bg-[#0D1C44] text-white text-lg font-semibold rounded-full hover:bg-[#1c2e6d] transition-colors duration-300"
        >
          REPORT PROBLEM
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
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
                className="h-[36rem] w-full object-cover rounded-lg"
              />

              {/* Label overlay for active */}
              <div 
                className={`absolute inset-0 flex items-end transition-all duration-700 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="absolute z-10 bottom-20  left-16 text-2xl text-white font-bold transition-all duration-700 ease-in-out">
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
                className="absolute z-10 bottom-[80px] left-16 origin-bottom-left transform -rotate-90 text-2xl text-white font-bold text-nowrap transition-all duration-700 ease-in-out"
              >
                {image.label}
              </p>



                {/* Small square box for collapsed cards */}
{!isActive && (
  <div className="absolute bottom-[60px] left-0 w-24 h-24 bg-[#0A182F] " />
)}

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroSection;
