"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoMoon, IoSunny } from "react-icons/io5";
import { useDarkMode } from "../utils/DarkModeContext";

function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [textOpacity, setTextOpacity] = useState(1);
  const logoRef = useRef(null);
  const textRef = useRef(null);


  return (
    <div className="w-full h-26 sticky px-20 pt-2 pb-1 top-0 z-50 bg-[#0A182F] dark:bg-black border-b border-gray-300 dark:border-gray-700 dark-transition home-navbar shadow-sm">
      {/* Single line navbar */}
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left side - Logo area remains the same */}
        <div className="flex items-center cursor-pointer" ref={logoRef}>
          <Link to="/" className="flex items-center">
            <img
              src={darkMode ? "/logo-dark.png" : "/logo-dark.png"}
              alt="NITK Logo"
              className="w-20 object-scale-down transition-all duration-300"
            />
            <div
              className="ml-2 leading-tight transition-opacity duration-300"
              style={{ opacity: textOpacity }}
              ref={textRef}
            >
              <h1 className="font-bold text-[#ffffff] dark:text-gray-200 text-xl dark-transition">National Institute of Technology Karnataka</h1>
              <h1 className="font-black text-[#ffffff] dark:text-gray-100 text-3xl dark-transition">CCC</h1>
            </div>
          </Link>
        </div>

        {/* Right side - Reordered navigation items */}
        <div className="flex items-center space-x-6">
          {/* Home link */}
          <Link
            to="/"
            className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
          >
            Home
          </Link>
          
          {/* Guides link */}
          <Link
            to="/guides"
            className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
          >
            Guides
          </Link>
          
          {/* Facilities link */}
          <Link
            to="/facilities"
            className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
          >
            Facilities
          </Link>
          
          {/* About Us link */}
          <Link
            to="/about"
            className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all dark-transition"
          >
            About
          </Link>
          
          {/* Search icon button */}
          <button 
            aria-label="Search"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <IoSearch className="text-xl text-gray-100 dark:text-gray-200" />
          </button>
          
          {/* Dark/Light mode toggle */}
          <button 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <IoSunny className="text-xl text-yellow-500" />
            ) : (
              <IoMoon className="text-xl text-gray-100 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;