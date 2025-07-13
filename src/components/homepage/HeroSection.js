import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactGA from 'react-ga4';

const HeroSection = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  // Images data
  const images = [
    { src: "/hero/ccc.jpg", alt: "CCC Building", label: "CCC Building" },
    { src: "/hero/lab.png", alt: "CCC Labs", label: "CCC Labs" },
    { src: "/hero/dc.jpg", alt: "Data Centre", label: "Data Centre" }
  ];

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

  // Handle progress bar and image rotation
  useEffect(() => {
    if (isHovered) {
      // Clear interval when hovered
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      return;
    }
    
    // Reset progress when starting new interval
    setProgress(0);
    
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // Update progress 60 times per 3 seconds (50ms intervals)
    const intervalDuration = 50;
    const totalDuration = 3000;
    const steps = totalDuration / intervalDuration;
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / steps);
        
        // When progress reaches 100%, change the image
        if (newProgress >= 100) {
          setActiveImage((prevIndex) => (prevIndex + 1) % images.length);
          return 0; // Reset progress
        }
        
        return newProgress;
      });
    }, intervalDuration);
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isHovered, images.length, activeImage]);

  const handleImageClick = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
      setProgress(0); // Reset progress when changing image
    }
  };

  const handleImageHover = (index) => {
    if (index !== activeImage) {
      setActiveImage(index);
      setProgress(0); // Reset progress when changing image
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
              onClick={() => ReactGA.event({ category: 'Home Hero', action: 'Click', label: 'View Guides' })}
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
              onClick={() => ReactGA.event({ category: 'Home Hero', action: 'Click', label: 'Facilities' })}
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
            className="mt-4 inline-flex items-center gap-2 px-6 md:px-9 py-3 md:py-[14px] bg-[#168a17] text-white dark:bg-blue-800 dark:text-white text-md md:text-lg font-semibold rounded-full hover:bg-[#1c2e6d] dark:hover:bg-blue-800 transition-colors duration-300"
            onClick={() => ReactGA.event({ category: 'Home Hero', action: 'Click', label: 'Report Problem' })}
          >
            REPORT PROBLEM
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[22px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Mobile: Accordion Images (still using click) */}
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
                    <p className="p-4 ml-2.5 mb-1 text-white tracking-wide font-semibold text-lg dark:text-gray-100">
                      {image.label}
                    </p>
                  ) : (
                    <div className="flex w-full items-center justify-between p-3">
                      <p className="text-white tracking-wide ml-2.5 mb-1 font-semibold dark:text-gray-100">
                        {image.label}
                      </p>
                      {/* Small square box for collapsed cards */}
                      {!isActive && (
                        <div className="absolute -z-10 bottom-[0px] left-4 w-14 h-14 bg-[#168a17] dark:bg-blue-950" />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Mobile Progress Indicator (on right side for active image) */}
                {isActive && !isHovered && (
                  <div className="absolute right-2 top-4 bottom-4 w-1 z-20 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 w-full rounded-full transition-all duration-100 ease-linear bg-gradient-to-r from-[#0A182F] dark:from-blue-950 to-blue-950 dark:to-blue-950"
                      style={{ 
                        height: `${progress}%`
                      }} 
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Desktop: Horizontal Expanding Cards (using hover) */}
      {!isMobile && (
        <motion.div
          className="w-full mt-3 md:w-[70%] flex gap-[38px]"
          initial="hidden"
          animate="visible"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
                onMouseEnter={() => handleImageHover(index)}
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

                {/* Overlay for all states (add gradient like mobile) */}
                <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/25 to-transparent flex items-end">
                  {/* Label overlay for active */}
                  <div 
                    className={`w-full transition-all duration-700 ease-in-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="absolute z-10 bottom-20 tracking-wider left-16 text-2xl text-white font-bold transition-all duration-700 ease-in-out dark:text-gray-100">
                      {image.label}
                    </p>
                  </div>

                  {/* Vertical text for collapsed */}
                  <div 
                    className={`w-full flex items-end justify-center transition-all duration-700 ease-in-out ${
                      !isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p 
                      className="absolute z-10 bottom-[80px] tracking-wider left-16 origin-bottom-left transform -rotate-90 text-2xl text-white font-bold text-nowrap transition-all duration-700 ease-in-out dark:text-gray-100"
                    >
                      {image.label}
                    </p>

                    {/* Small square box for collapsed cards */}
                    {!isActive && (
                      <div className="absolute bottom-[60px] left-0 w-24 h-24 bg-[#168a17] dark:bg-blue-950" />
                    )}
                  </div>
                </div>

                {/* Desktop Progress Indicator (at bottom for active image) */}
                {isActive && !isHovered && (
                  <div className="absolute bottom-5 left-5 right-5 h-1.5 z-20 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-100 ease-linear bg-gradient-to-r from-green-700 dark:from-blue-950 to-[#168a17] dark:to-blue-950"
                      style={{ 
                        width: `${progress}%`
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;