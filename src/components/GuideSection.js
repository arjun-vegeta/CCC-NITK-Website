import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const GuideSection = () => {
  const infoBoxes = [
    {
      heading: "Eduroam",
      description: "Guide to connecting to eduroam WiFi at NITK",
      image: "/HomeGuide/image1.jpg",
      link: "/network-guides/eduroam"
    },
    {
      heading: "NITK Net",
      description: "NITK Net Captive Portal Configuration",
      image: "/HomeGuide/image2.jpg",
      link: "/network-guides/captive_portal"
    },
    {
      heading: "Troubleshooting",
      description: "Step-by-step guide for troubleshooting network",
      image: "/HomeGuide/image3.jpg",
      link: "/network-guides/guide_for_troubleshooting"
    },
    {
      heading: "NITK VPN",
      description: "Guide to request and connect to NITK VPN",
      image: "/HomeGuide/image4.jpg",
      link: "/network-guides/vpn"
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto py-16 px-4 font-Montserrat">
      {/* Heading */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1C44] mb-6">
          Learn More About Guides
        </h2>
        <p className="text-gray-600">
          Some Long Description Line Goes Right Here, Keep It Long Itself For Design Sake
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-10">
        {infoBoxes.map((box, index) => (
          <GuideCard key={index} box={box} index={index} />
        ))}
      </div>

      {/* View All Guides Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <Link
          to="/network-guides"
          className="inline-block px-8 py-3 bg-[#0D1C44] text-white rounded-full text-md font-semibold hover:bg-[#1a2e60] transition-colors duration-300"
        >
          View All Guides
        </Link>
      </motion.div>
    </section>
  );
};

const GuideCard = ({ box, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={box.link}>
        <div
          className="rounded-2xl aspect-square mb-3 p-4 flex flex-col justify-end relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(30,44,80,0.3), rgba(30,44,80,0.9)), url(${box.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Animated Circle */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-[#0D1C44] flex items-center justify-center shadow-lg pointer-events-none"
            initial={{ y: "-120%", opacity: 0 }}
            animate={{
              y: hovered ? "0%" : "-120%",
              opacity: hovered ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.0}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </motion.div>

          {/* Card Content */}
          <div>
            <h3 className="font-bold text-white text-lg mb-1">{box.heading}</h3>
            <p className="text-gray-200 text-sm">{box.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GuideSection;
