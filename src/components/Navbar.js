"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoMoon, IoSunny } from "react-icons/io5"; // Add IoMoon and IoSunny icons
import { useDarkMode } from "../utils/DarkModeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [textOpacity, setTextOpacity] = useState(1);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const searchBarRef = useRef(null);
  const navLinksRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setTextOpacity(0);
      } else {
        setTextOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full pt-5 top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 dark-transition">
      {/* 🔝 Top Row: Controls */}
      <div className="flex items-center justify-between px-6 py-2 text-sm bg-gray-100 dark:bg-gray-800 dark-transition">
        <div>
          <button 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <IoSunny className="text-xl text-yellow-500" />
            ) : (
              <IoMoon className="text-xl text-gray-700 dark:text-gray-400" />
            )}
          </button>
        </div>
        <div>
          <button className="border px-2 py-1 rounded dark:border-gray-600 dark:text-gray-200">EN / हि</button>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className="w-full bg-white dark:bg-gray-900 transition-all duration-300 dark-transition"
      >
        {/* Update the existing classes with dark mode variants */}
        <div className="flex items-center px-6 transition-all duration-300">
          
          {/* Logo area with dark mode text colors */}
          <div className="flex items-center cursor-pointer" ref={logoRef}>
            <Link to="/" className="flex items-center">
              <img
                src={darkMode ? "/logo-dark.png" : "/logo-light.png"}
                alt="NITK Logo"
                className="w-10 object-scale-down transition-all duration-300"
              />
              <div
                className="ml-2 leading-tight transition-opacity duration-300"
                style={{ opacity: textOpacity }}
                ref={textRef}
              >
                <h1 className="font-bold text-gray-800 dark:text-gray-200 text-xl dark-transition">National Institute of Technology Karnataka</h1>
                <h1 className="font-black text-gray-900 dark:text-gray-100 text-3xl dark-transition">CCC</h1>
              </div>
            </Link>
          </div>

          {/* Search bar with dark mode styling */}
          <div className="flex justify-center w-[300px] mx-auto" ref={searchBarRef}>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full w-full">
              <IoSearch className="text-gray-500 dark:text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 w-full rounded-full text-sm bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 dark-transition"
              />
            </div>
          </div>

          {/* Navigation links with dark mode hover states */}
          <div className="flex items-center space-x-6 ml-auto" ref={navLinksRef}>
            <Link
              to="/network-guides"
              className="font-semibold text-[#192F59] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
            >
              Guides
            </Link>
            <Link
              to="/facilities"
              className="font-semibold text-[#192F59] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
            >
              Facilities
            </Link>
            <Link
              to="/about"
              className="font-semibold text-[#192F59] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="font-semibold text-[#192F59] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;