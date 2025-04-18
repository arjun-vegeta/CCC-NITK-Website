import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const images = [
    { src: "/hero/ccc.jpg", alt: "CCC Building", label: "CCC Main Building" },
    { src: "/images_mdx/Lab.png", alt: "CCC Labs", label: "CCC Labs" },
    { src: "/hero/dc.jpg", alt: "Data Centre", label: "Data Centre" }
  ];

  const handleImageClick = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center p-4 max-w-[1280px] mx-auto mt-0 md:mt-6 font-Montserrat">
      {/* Left Text Block */}
      <div className="w-full md:w-[35%] flex flex-col gap-4 md:gap-10 mb-6 md:mb-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-5xl md:text-[62px] font-black leading-snug text-[#0D1C44] dark:text-white"
        >
          CENTRAL <br />
          COMPUTER <br />
          CENTRE
        </motion.h1>

        <motion.div
          className="flex mt-2 flex-wrap gap-3 md:gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.8,
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Link
              to="/guides"
              className="px-5 md:px-9 py-3 md:py-[14px] border-2 border-[#0D1C44] text-[#0D1C44] dark:text-blue-200 dark:border-blue-200 rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white dark:hover:bg-blue-900 dark:hover:text-white transition-colors duration-300"
            >
              VIEW GUIDES
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Link
              to="/facilities"
              className="px-5 md:px-9 py-3 md:py-[14px] border-2 border-[#0D1C44] text-[#0D1C44] dark:text-blue-200 dark:border-blue-200 rounded-full text-md font-semibold hover:bg-[#0D1C44] hover:text-white dark:hover:bg-blue-900 dark:hover:text-white transition-colors duration-300"
            >
              FACILITIES
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <Link
            to="/guides/problem-reporting"
            className="mt-4 inline-flex items-center gap-2 px-6 md:px-9 py-3 md:py-[14px] bg-[#0D1C44] text-white dark:bg-blue-800 dark:text-white text-md md:text-lg font-semibold rounded-full hover:bg-[#1c2e6d] dark:hover:bg-blue-800 transition-colors duration-300"
          >
            REPORT PROBLEM
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-[22px]">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>

          </Link>
        </motion.div>
      </div>

      {/* Mobile: Accordion Images */}
      {isMobile && (
        <motion.div
          className="w-full flex flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
              }
            }
          }}
        >
          {images.map((image, index) => {
            const isActive = activeImage === index;
            return (
              <motion.div
                key={index}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                  isActive ? "h-64" : "h-16"
                } w-full`}
                onClick={() => handleImageClick(index)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
                {/* Overlay for all states */}
                <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  {isActive ? (
                    <p className="p-4 ml-2.5 mb-1 text-white font-semibold text-lg dark:text-gray-100">
                      {image.label}
                    </p>
                  ) : (
                    <div className="flex w-full items-center justify-between p-3">
                      <p className="text-white ml-2.5 mb-1 font-semibold dark:text-gray-100">
                        {image.label}
                      </p>
                                        {/* Small square box for collapsed cards */}
                  {!isActive && (
                    <div className="absolute -z-10 bottom-[0px] left-4 w-14 h-14 bg-[#0A182F] dark:bg-blue-950" />
                  )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Desktop: Horizontal Expanding Cards */}
      {!isMobile && (
        <motion.div
          className="w-full mt-3 md:w-[70%] flex gap-[38px]"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
              }
            }
          }}
        >
          {images.map((image, index) => {
            const isActive = activeImage === index;
            return (
              <motion.div
                key={index}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
                  isActive ? "w-[60%]" : "w-[15%]"
                }`}
                onClick={() => handleImageClick(index)}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 }
                }}
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
                  <p className="absolute z-10 bottom-20 left-16 text-2xl text-white font-bold transition-all duration-700 ease-in-out dark:text-gray-100">
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
                    className="absolute z-10 bottom-[80px] left-16 origin-bottom-left transform -rotate-90 text-2xl text-white font-bold text-nowrap transition-all duration-700 ease-in-out dark:text-gray-100"
                  >
                    {image.label}
                  </p>

                  {/* Small square box for collapsed cards */}
                  {!isActive && (
                    <div className="absolute bottom-[60px] left-0 w-24 h-24 bg-[#0A182F] dark:bg-blue-950" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;