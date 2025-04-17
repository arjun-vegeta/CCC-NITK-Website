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
  
  // Dynamic underline state
  const [underlineStyle, setUnderlineStyle] = useState({ 
    width: 0, 
    left: 0, 
    opacity: 0 
  });
  const [isHovering, setIsHovering] = useState(false);
  const navItemsRef = useRef([]);
  const navContainerRef = useRef(null);
  
  // Calculate underline position more precisely
  const calculateUnderlinePosition = (index) => {
    const item = navItemsRef.current[index];
    const container = navContainerRef.current;
    
    if (item && container) {
      const rect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Get the text node width more precisely
      const textWidth = rect.width;
      
      // Calculate position relative to the container
      const left = rect.left - containerRect.left;
      
      return { width: textWidth, left };
    }
    
    return { width: 0, left: 0 };
  };
  
  // Set default underline position on initial render (Home)
  useEffect(() => {
    const position = calculateUnderlinePosition(0);
    
    // Set initial position but keep opacity 0 initially
    setUnderlineStyle({
      width: position.width,
      left: position.left,
      opacity: 0
    });
  }, []);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isHovering) {
        // Find the currently hovered index
        const index = navItemsRef.current.findIndex(ref => 
          ref === document.activeElement || ref.matches(':hover')
        );
        
        if (index >= 0) {
          const position = calculateUnderlinePosition(index);
          setUnderlineStyle(prev => ({
            ...prev,
            width: position.width,
            left: position.left
          }));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHovering]);

  // Handle hover effect
  const handleMouseEnter = (index) => {
    const position = calculateUnderlinePosition(index);
    
    setUnderlineStyle({
      width: position.width,
      left: position.left,
      opacity: 1
    });
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setUnderlineStyle(prev => ({
      ...prev,
      opacity: 0
    }));
    setIsHovering(false);
  };

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

        {/* Right side - Navigation with dynamic underline */}
        <div className="flex items-center space-x-6">
          {/* Navigation links */}
          <div 
            className="flex items-center space-x-6 relative" 
            onMouseLeave={handleMouseLeave}
            ref={navContainerRef}
          >
            {/* Home link - Using spans inside links for more precise text measuring */}
            <Link
              to="/"
              ref={el => navItemsRef.current[0] = el}
              onMouseEnter={() => handleMouseEnter(0)}
              className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all dark-transition py-2 px-0"
            >
              <span className="inline-block">Home</span>
            </Link>
            
            {/* Guides link */}
            <Link
              to="/guides"
              ref={el => navItemsRef.current[1] = el}
              onMouseEnter={() => handleMouseEnter(1)}
              className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all dark-transition py-2 px-0"
            >
              <span className="inline-block">Guides</span>
            </Link>
            
            {/* Facilities link */}
            <Link
              to="/facilities"
              ref={el => navItemsRef.current[2] = el}
              onMouseEnter={() => handleMouseEnter(2)}
              className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all dark-transition py-2 px-0"
            >
              <span className="inline-block">Facilities</span>
            </Link>
            
            {/* About Us link */}
            <Link
              to="/about"
              ref={el => navItemsRef.current[3] = el}
              onMouseEnter={() => handleMouseEnter(3)}
              className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all dark-transition py-2 px-0"
            >
              <span className="inline-block">About</span>
            </Link>
            
            {/* Dynamic underline element */}
            <div 
              className="absolute bottom-0 bg-[#0FA444] h-0.5 transition-all duration-300 ease-in-out"
              style={{
                width: `${underlineStyle.width}px`,
                left: `${underlineStyle.left - 22}px`,
                opacity: underlineStyle.opacity,
                transform: 'translateY(-2px)'
              }}
            />
          </div>
          
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