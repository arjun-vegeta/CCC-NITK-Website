import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TimelineDemo } from "../FacilityInfoTimeline";

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
    description: "Reliable hosting services with seamless management and monitoring."
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoChanging] = useState(true);

  // Create refs for intersection observers
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" });

  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" });

  // Create refs for each facility item to track visibility
  const facilityRefs = useRef(facilities.map(() => React.createRef()));

  // Auto-changing facility every 5 seconds
  useEffect(() => {
    let intervalId;

    if (isAutoChanging) {
      intervalId = setInterval(() => {
        const nextIndex = (activeIndex + 1) % facilities.length;
        setActiveIndex(nextIndex);
        setSelectedFacility(facilities[nextIndex]);
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeIndex, isAutoChanging]);

  // Set up intersection observers for mobile scrolling behavior
  useEffect(() => {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    // Create a copy of the current refs to use in cleanup
    const currentRefs = facilityRefs.current;

    const observers = currentRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setSelectedFacility(facilities[index]);
          }
        },
        { threshold: 0.7 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    });

    // Cleanup observers using the copied refs
    return () => {
      observers.forEach((observer, index) => {
        if (currentRefs[index].current) {
          observer.unobserve(currentRefs[index].current);
        }
      });
    };
  }, []);  // Deps array remains empty

  const handleFacilityClick = (facility, index) => {
    setActiveIndex(index);
    setSelectedFacility(facility);

  };

  return (
    <div className="w-full max-w-[1280px] mx-auto md:px-6 py-12 font-Montserrat">
      <div className="flex justify-between items-start mb-8 flex-wrap">
        {/* Heading */}
        <motion.h2
          ref={headingRef}
          initial="hidden"
          animate={isHeadingInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-4xl font-bold text-[#0D1C44] dark:text-white ml-4 md:text-3xl sm:text-2xl"
        >
          Some of our Facilities
        </motion.h2>

        {/* Learn more link - Hidden on mobile */}
        <motion.div
          className="text-right hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          <p className="text-lg mt-2 mb-1 text-gray-700 dark:text-blue-300">Learn more about all the facilities provided by ccc</p>
          <Link to="/facilities" className="text-lg font-medium text-[#1a365d] dark:text-blue-100 underline underline-offset-2 flex items-center justify-end">
            Facilities Page
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
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
            const isActive = activeIndex === index;
            const isHovered = hoveredFacility === facility.id;

            return (
              <motion.div
                key={facility.id}
                custom={index}
                variants={fadeInUp}
                className="flex mb-9 cursor-pointer"
                onClick={() => handleFacilityClick(facility, index)}
                onMouseEnter={() => setHoveredFacility(facility.id)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                {/* Timeline dot and line */}
                <div className="relative mr-4">
                  <div className={`bg-[#0D1C44] rounded-full h-14 w-14 flex items-center justify-center z-10 relative`}>
                    {/* Active indicator (triangle) */}
                    {isActive && (
                      <div className="absolute w-5 h-5 bg-white rounded-full"></div>
                    )}

                    {/* Hover indicator (inner circle) */}
                    {isHovered && !isActive && (
                      <div className="absolute w-4 h-4 bg-gray-400 rounded-full"></div>
                    )}
                  </div>

                  {index < facilities.length - 1 && (
                    <div className="absolute top-16 bottom-0 left-1/2 w-[3px] rounded-b-full bg-[#1a365d] -translate-x-1/2 h-[66px] overflow-hidden">
                      {/* Color fill animation from top to bottom */}
                      {isActive && (
                        <motion.div
                          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-green-600 dark:from-blue-700 to-green-400 dark:to-blue-400"
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: 0
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Facility text with hover effect */}
                <div>
                  <h3
                    className={`text-lg transition-colors duration-300 ${isActive ? 'font-bold' : 'font-bold'} ${isHovered ? 'text-[#3182ce] dark:text-blue-500' : isActive ? 'text-[#3182ce] dark:text-blue-400' : 'text-[#1a365d] dark:text-blue-200'}`}
                  >
                    {facility.name}
                  </h3>
                  <p
                    className={`whitespace-pre-line transition-colors duration-300 ${isActive ? 'font-normal' : 'font-normal'} ${isHovered ? 'text-[#3182ce] dark:text-blue-200' : isActive ? 'text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}
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
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Mobile Layout - Scrollable Timeline */}
      <div className="md:hidden">
        <TimelineDemo />
        {/* View All Facilities button for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/facilities"
            className="bg-[#0D1C44] text-white py-3 px-8 rounded-full font-semibold shadow-md hover:bg-[#152a5c] transition-colors text-center"
          >
            View All Facilities
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FacilityInfo;