import React, { useState, useRef, useEffect } from 'react';
import { IoMoon, IoSunny, IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function NavbarTest() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  
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

  const toggleDarkMode = () => setDarkMode(!darkMode);
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
      <div className="flex justify-between items-center p-2 h-8 bg-gray-200">
        <button className="p-2 text-gray-700 hover:text-gray-900" onClick={toggleDarkMode}>
          {darkMode ? <IoSunny size={20} /> : <IoMoon size={20} />}
        </button>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-sm bg-transparent border-none cursor-pointer" onClick={toggleLanguage}>
            {language}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="relative flex items-center p-4 bg-white border-t border-gray-300 shadow-md">
        {/* Logo & Titles - Wrapped in Link to navigate to homepage */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="College Logo" className="w-24" />
          <div className="text-left">
            <h1 className="text-xl font-bold">National Institute of Technology Karnataka</h1>
            <h2 className="text-3xl font-black text-black">CCC</h2>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex justify-center text-lg flex-grow">
          <div className="flex items-center border border-gray-300 rounded-full w-[350px]">
            <IoSearch className="text-gray-500 ml-4" />
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 w-full rounded-full text-sm focus:outline-none"
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
              className="text-lg font-semibold text-gray-700 relative z-10 hover:text-[#0FA444]"
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