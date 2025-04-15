import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const facilities = [
  { 
    id: 1, 
    name: "Data Centre & Server Infrastructure", 
    image: "/hero/dc.jpg",
    description: "High-performance servers and secure data storage for all your business needs."
  },
  { 
    id: 2, 
    name: "General Purpose Computing & Labs", 
    image: "/images_mdx/Lab.png",
    description: "Fully equipped labs for software development, research, and innovation."
  },
  { 
    id: 3, 
    name: "Website Hosting & Management Service", 
    image: "/hero/dc.png",
    description: "Reliable hosting services with seamless management and  monitoring."
  },
  { 
    id: 4, 
    name: "Skill Development Centre", 
    image: "/images_mdx/Lab.png",
    description: "Enhancing skills through training programs and hands-on learning."
  },
];


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

// Enhanced image animations
const imageVariants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1] 
    } 
  },
};

const FacilityInfo = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [hoveredFacility, setHoveredFacility] = useState(null);
  
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" });

  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" });

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12 font-Montserrat">
      <div className="flex justify-between items-start mb-8">
        {/* Heading */}
        <motion.h2
          ref={headingRef}
          initial="hidden"
          animate={isHeadingInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-4xl font-bold text-[#0D1C44]"
        >
          Some of our Facilities
        </motion.h2>
        
        {/* Learn more link */}
        <motion.div 
  className="text-right"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.7 }}
  viewport={{ once: true, amount: 0.9 }}
>

          <p className="text-lg mt-2 mb-1">Learn more about all the facilities provided by ccc</p>
          <Link to="/facilities" className="text-lg font-medium text-[#1a365d] underline underline-offset-2 flex items-center justify-end">
            Facilities Page
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Timeline */}
        <motion.div
          className="w-1/3 mr-10"
          ref={timelineRef}
          initial="hidden"
          animate={isTimelineInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              }
            }
          }}
        >
          {facilities.map((facility, index) => {
            const isActive = selectedFacility.id === facility.id;
            const isHovered = hoveredFacility === facility.id;
            
            return (
              <motion.div 
                key={facility.id} 
                custom={index}
                variants={fadeInUp}
                className="flex mb-9 cursor-pointer"
                onClick={() => handleFacilityClick(facility)}
                onMouseEnter={() => setHoveredFacility(facility.id)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                {/* Timeline dot and line */}
                <div className="relative mr-4">
                  <div className={`bg-[#0D1C44] rounded-full h-14 w-14 flex items-center justify-center z-10 relative`}>
                    {/* Active indicator (triangle) */}
                    {isActive && (
                      // <div className="w-0 h-0 translate-x-[2px]
                      //   border-t-[10px] border-t-transparent 
                      //   border-l-[15px] border-l-white 
                      //   border-b-[10px] border-b-transparent">
                      // </div>
                      <div className="absolute w-5 h-5 bg-white rounded-full"></div>
                    )}
                    
                    {/* Hover indicator (inner circle) */}
                    {isHovered && !isActive && (
                      <div className="absolute w-4 h-4 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  
                  {index < facilities.length - 1 && (
                    <div className="absolute top-16 bottom-0 left-1/2 w-0.5 bg-[#1a365d] -translate-x-1/2 h-[66px]"></div>
                  )}
                </div>
                
                {/* Facility text with hover effect */}
                <div>
                  <h3 
                    className={`text-lg transition-colors duration-300 ${
                      isActive ? 'font-bold' : 'font-bold'
                    } ${isHovered ? 'text-[#3182ce]' : 'text-[#1a365d]'}`}  
                  >
                    {facility.name}
                  </h3>
                  <p 
                    className={`whitespace-pre-line transition-colors duration-300 ${
                      isActive ? 'font-normal' : 'font-normal'
                    } ${isHovered ? 'text-[#3182ce]' : 'text-gray-700'}`}

                  >
                    {facility.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Content - Image with enhanced animations */}
        <motion.div
          className="w-2/3 relative mt-6"
          ref={imageRef}
          initial={{ opacity: 0 }}
          animate={isImageInView ? { opacity: 1, transition: { duration: 0.9, delay: 0.5 } } : {}}
        >
          <div className="rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFacility.id}
                initial="enter"
                animate="center"
                exit="exit"
                variants={imageVariants}
                className="relative"
                style={{ transformOrigin: "center" }}
              >
                <motion.img
                  src={selectedFacility.image || "/images_mdx/placeholder.png"}
                  alt={selectedFacility.name}
                  className="w-full h-[450px] object-cover"
                  onError={(e) => {
                    e.target.src = "/images_mdx/placeholder.png";
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                />
                
                {/* Optional highlight boxes */}
                {/* <div className="absolute top-4 right-4 flex space-x-4">
                  <div className="bg-[#1a365d] text-white p-6 rounded-lg">
                    <h4 className="text-xl font-semibold mb-2">Facility Highlight</h4>
                    <p>Description text</p>
                  </div>
                  <div className="bg-[#1a365d] text-white p-6 rounded-lg">
                    <h4 className="text-xl font-semibold mb-2">Facility Highlight</h4>
                    <p>Description text</p>
                  </div>
                </div> */}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacilityInfo;