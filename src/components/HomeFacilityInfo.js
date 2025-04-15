import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const facilities = [
  { id: 1, name: "Facility 1", image: "/images_mdx/placeholder.png" },
  { id: 2, name: "Facility 2", image: "/images_mdx/placeholder.png" },
  { id: 3, name: "Facility 3", image: "/images_mdx/placeholder.png" },
  { id: 4, name: "Facility 4", image: "/images_mdx/placeholder.png" },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,       // Slightly more delayed
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // Match the child delay
    },
  },
};

const FacilityInfo = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [isImageError, setIsImageError] = useState(false);

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" });

  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" });

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setIsImageError(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] px-6 py-12 bg-white">
      {/* Heading */}
      <motion.h2
        ref={headingRef}
        initial="hidden"
        animate={isHeadingInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="text-4xl font-semibold text-gray-800 mb-0"
      >
        Some of our <br />
        <span>Facilities</span>
      </motion.h2>

      <div className="flex">
        {/* Left Sidebar - Timeline */}
        <motion.div
          className="w-1/3 flex flex-col justify-around"
          ref={timelineRef}
          variants={containerVariants}
          initial="hidden"
          animate={isTimelineInView ? "visible" : "hidden"}
        >
          {facilities.map((facility, index) => (
            <motion.div
              custom={index}
              variants={fadeInUp}
              className="flex items-center justify-start gap-x-3 mb-0"
              key={facility.id}
            >
              <div
                className={`relative ${index === facilities.length - 1
                  ? ""
                  : "after:absolute after:top-14 after:-bottom-16 after:start-0 after:w-[3px] after:translate-x-[26px] after:bg-[#172F59]"
                  }`}
              >
                <div className="relative z-10 size-19 flex justify-center items-center">
                  <div className="size-14 rounded-full bg-[#172F59]"></div>
                </div>
              </div>

              <div>
                <h3
                  className="flex gap-x-1.5 text-2xl cursor-pointer font-semibold text-[#172F59]"
                  onClick={() => handleFacilityClick(facility)}
                >
                  {facility.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Content - Image or Placeholder */}
        <motion.div
          className="w-2/3 flex justify-end items-start relative"
          ref={imageRef}
          initial={{ opacity: 0 }}
          animate={isImageInView ? { opacity: 1, transition: { duration: 0.9 } } : {}}
        >
          <div className="bg-white shadow-lg rounded-t-xl overflow-hidden border border-gray-300 w-full">
            {/* Browser Tab */}
            <div className="absolute w-[20%] flex justify-center -top-8 left-4 bg-[#172F59] px-4 py-1 rounded-t-xl shadow font-medium text-white ml-2 text-xl">
              {selectedFacility.name}
            </div>

            {/* Facility Image or Placeholder */}
            <div className="w-full bg-[#192F59] h-[calc(100vh-150px)] flex items-center justify-center">
              {!isImageError ? (
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() => setIsImageError(true)}
                />
              ) : (
                <div className="text-white text-3xl font-semibold text-center">
                  {selectedFacility.name}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacilityInfo;
