import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactGA from 'react-ga4';

const GuideSection = () => {
  const infoBoxes = [
    {
      heading: "Request For Subdomain",
      description: "Instructions to request for subdomain (.nitk.ac.in).",
      image: "/guides/url.png",
      link: "/guides/request-institute-url"
    },
    {
      heading: "Request For Container",
      description: "Steps to request a Container/ Virtual Machine from CCC.",
      image: "/guides/server.png",
      link: "/guides/request-container"
    },
    {
      heading: "Guest Captive Portal ID",
      description: "How to request a guest login ID for NITK's captive portal.",
      image: "/guides/captive.png",
      link: "/guides/request-captive-id"
    },
    {
      heading: "Request For NITK VPN",
      description: "Guide to request VPN and connect securely to NITK's network.",
      image: "/guides/vpn.png",
      link: "/guides/request-vpn-access"
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
        <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#0D1C44] dark:text-white mb-6">
          Learn More About Guides
        </h2>
        <p className="text-gray-600 dark:text-blue-300">
          Discover guides to help you navigate the Central Computer Centre's services, resources and facilities.
        </p>
      </motion.div>

      {/* Cards Grid - Updated for responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
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
        viewport={{ once: true, amount: 0.1 }}
      >
        <Link
          to="/guides"
          className="inline-block mt-3 px-8 py-3 bg-[#168a17] text-white rounded-full text-md font-semibold hover:bg-[#3857a5] transition-colors duration-300"
          onClick={() => ReactGA.event({ category: 'Home GuideSection', action: 'Click', label: 'View All Guides' })}
        >
          View All Guides
        </Link>
      </motion.div>
    </section>
  );
};

const GuideCard = ({ box, index }) => {
  const [hovered, setHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

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
      <Link to={box.link} onClick={() => ReactGA.event({ category: 'Home GuideSection', action: 'Click', label: box.heading })}>
        <div
          className="rounded-2xl aspect-square mb-3 p-4 flex flex-col justify-end relative overflow-hidden"
          style={{
            backgroundImage: `url(${box.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {/* Animated Circle - Always visible on mobile */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-[#0D1C44] flex items-center justify-center shadow-lg pointer-events-none"
            initial={{ y: isMobile ? "0%" : "-120%", opacity: isMobile ? 1 : 0 }}
            animate={{
              y: hovered || isMobile ? "0%" : "-120%",
              opacity: hovered || isMobile ? 1 : 0
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
            <h3 className="font-bold text-white text-lg mb-1 dark:text-blue-200">{box.heading}</h3>
            <p className="text-gray-200 text-sm dark:text-gray-300">{box.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GuideSection;