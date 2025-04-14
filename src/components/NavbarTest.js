import React, { useState, useRef, useEffect } from 'react';
import { IoMoon, IoSunny, IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../utils/DarkModeContext';

function NavbarTest() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [language, setLanguage] = useState('EN');
  const [isLogoVisible, setIsLogoVisible] = useState(true); // Track logo visibility
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true); // Track search bar visibility
  
  // State to track the underline's position, width, and opacity
  const [underlinePosition, setUnderlinePosition] = useState({ left: 0, width: 0, opacity: 0 });
  
  // Refs for each nav link to measure their position and size
  const navLinkRefs = useRef([]);
  
  const navLinks = [
    { to: "/about-us", label: "About Us" },
    { to: "/facilities", label: "Facilities" },
    { to: "/network-guides", label: "Network Guides" },
    { to: "/contact", label: "Contact" },
  ];

  const toggleLanguage = () => setLanguage(language === 'EN' ? 'हिन्दी' : 'EN');

  // Handle hover to update underline position and width
  const handleMouseEnter = (index) => {
    const linkElement = navLinkRefs.current[index];
    const rect = linkElement.getBoundingClientRect();
    setUnderlinePosition({
      left: rect.left - linkElement.parentElement.getBoundingClientRect().left,
      width: rect.width,
      opacity: 1
    });
  };

  // Handle mouse leave to hide the underline
  const handleMouseLeave = () => {
    setUnderlinePosition(prev => ({
      ...prev,
      opacity: 0
    }));
  };

  return (
    <div className="sticky -top-10 z-50 w-full">
      {/* Top Row */}
      <div className="flex justify-between items-center p-2 h-8 bg-gray-200 dark:bg-gray-800">
        <button 
          className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <IoSunny className="text-yellow-500" size={20} />
          ) : (
            <IoMoon className="text-gray-700 dark:text-gray-400" size={20} />
          )}
        </button>
        <div className="flex items-center space-x-2">
          <button 
            className="px-4 py-2 text-sm bg-transparent border-none cursor-pointer dark:text-gray-200"
            onClick={toggleLanguage}
          >
            {language}
          </button>
        </div>
      </div>

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Main Navbar */}
      <div className="relative flex items-center p-4 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 shadow-md">
        {/* Logo & Titles - Wrapped in Link to navigate to homepage */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={darkMode ? "/logo-white.png" : "/logo-dark.png"} alt="College Logo" className="w-24" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">National Institute of Technology Karnataka</h1>
            <h2 className="text-3xl font-black text-black dark:text-white">CCC</h2>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex justify-center text-lg flex-grow">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full w-[350px]">
            <IoSearch className="text-gray-500 dark:text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 w-full rounded-full text-sm focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Nav Links with Dynamic Underline */}
        <div className="relative ml-auto flex space-x-6">
          {/* Magic Underline (now dynamic) */}
          <span
            className="absolute bottom-0 h-0.5 bg-[#0FA444] transition-all duration-300"
            style={{
              left: underlinePosition.left,
              width: underlinePosition.width,
              opacity: underlinePosition.opacity
            }}
          />

          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              ref={el => navLinkRefs.current[index] = el} // Assigning ref to each link
              className="text-lg font-semibold text-gray-700 dark:text-gray-200 relative z-10 hover:text-[#0FA444] dark:hover:text-[#0FA444]"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavbarTest;