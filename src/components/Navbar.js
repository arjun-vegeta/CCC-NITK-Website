import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoMoon, IoSunny } from "react-icons/io5";
import { useDarkMode } from "../utils/DarkModeContext";
import SearchbarModal from "./SearchBarModal";
import GoogleTranslate from "./googleTranslate";

function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [textOpacity ] = useState(1);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navItemsRef = useRef([]);
  const navContainerRef = useRef(null);

  // Tooltip visibility states
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [showSearchTooltip, setShowSearchTooltip] = useState(false);

  const [showSearchBar, setSearchBar] = useState(false);
  
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const calculateUnderlinePosition = (index) => {
    const item = navItemsRef.current[index];
    const container = navContainerRef.current;

    if (item && container) {
      const rect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const textWidth = rect.width;
      const left = rect.left - containerRect.left;

      return { width: textWidth, left };
    }

    return { width: 0, left: 0 };
  };

  useEffect(() => {
    const position = calculateUnderlinePosition(0);
    setUnderlineStyle({
      width: position.width,
      left: position.left,
      opacity: 0
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isHovering) {
        const index = navItemsRef.current.findIndex(ref => 
          ref === document.activeElement || ref?.matches?.(':hover')
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
      
      // Close mobile menu on resize above mobile breakpoint
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHovering, isMenuOpen]);

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

  // Close the search modal
  const closeSearchBar = () => {
    setSearchBar(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // No longer need the handleOutsideClick since we moved that logic to the SearchbarModal component

  return (
    <div className="w-full sticky top-0 z-50 bg-[#0A182F] dark:bg-black border-b border-gray-300 dark:border-gray-700 dark-transition home-navbar shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-2">
        
        {/* Logo */}
        <div className="flex items-center cursor-pointer" ref={logoRef}>
          <Link to="/" className="flex items-center">
            <img
              src={darkMode ? "/logo-dark.png" : "/logo-dark.png"}
              alt="NITK Logo"
              className="w-12 md:w-20 p-0 md:p-2 object-scale-down transition-all duration-300"
            />
            <div
              className="ml-2 leading-tight transition-opacity duration-300"
              style={{ opacity: textOpacity }}
              ref={textRef}
            >
 <h1 className="font-bold text-[#ffffff] dark:text-gray-200 text-sm lg:text-xl dark-transition">
    National Institute of Technology Karnataka
  </h1>
  <h1 className="font-black text-[#ffffff] dark:text-gray-100 text-2xl lg:text-4xl tracking-widest dark-transition">
  CCC
</h1>

            </div>
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none"
            aria-label="Toggle menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? 'rotate-45 translate-y-1' : ''
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-white rounded-sm mt-1.5 transition-all duration-300 ease-out ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-white rounded-sm mt-1.5 transition-all duration-300 ease-out ${
                isMenuOpen ? '-rotate-45 -translate-y-[11px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation and Controls (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          
          {/* Navigation Links */}
          <div 
            className="flex items-center space-x-6 relative" 
            onMouseLeave={handleMouseLeave}
            ref={navContainerRef}
          >
            {["Home", "Guides", "Facilities", "People"].map((label, i) => (
              <Link
                key={label}
                to={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
                ref={el => navItemsRef.current[i] = el}
                onMouseEnter={() => handleMouseEnter(i)}
                className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all dark-transition py-2 px-0"
              >
                <span className="inline-block">{label}</span>
              </Link>
            ))}

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

          {/* Search Icon with Tooltip */}
          <div 
            className="relative flex flex-col items-center"
            onMouseEnter={() => setShowSearchTooltip(true)}
            onMouseLeave={() => setShowSearchTooltip(false)}
          >
            <button 
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setSearchBar(!showSearchBar)}
            >
              <IoSearch className="text-xl text-gray-100 dark:text-gray-200" />
            </button>
            {showSearchTooltip && (
              <div className="absolute top-full mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                Toggle search
              </div>
            )}
          </div>

          {/* Dark/Light Mode Toggle with Tooltip */}
          <div 
            className="relative flex flex-col items-center"
            onMouseEnter={() => setShowThemeTooltip(true)}
            onMouseLeave={() => setShowThemeTooltip(false)}
          >
            <button 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <IoSunny className="text-xl text-gray-100" />
              ) : (
                <IoMoon className="text-xl text-gray-100 dark:text-gray-400" />
              )}
            </button>
            {showThemeTooltip && (
              <div className="absolute top-full mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                Toggle theme
              </div>
            )}
          </div>

          {/* Google Translate Button */}
          <div className="ml-2">
            <GoogleTranslate />
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-2 bg-[#0A182F] dark:bg-black">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-4 py-4">
            {["Home", "Guides", "Facilities", "People"].map((label) => (
              <Link
                key={label}
                to={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
                className="font-semibold text-[#ffffff] dark:text-gray-200 hover:text-[#0FA444] dark:hover:text-[#0FA444] transition-all py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Search and Theme Controls */}
          <div className="flex items-center justify-between py-4 border-t border-gray-700">
            <button 
              onClick={() => {
                setSearchBar(!showSearchBar);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-white p-2"
            >
              <IoSearch className="text-xl" />
              <span>Search</span>
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-white p-2"
            >
              {darkMode ? (
                <>
                  <IoSunny className="text-xl" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <IoMoon className="text-xl" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Updated SearchbarModal call - no ref being passed */}
      <SearchbarModal display={showSearchBar} closeSearch={closeSearchBar} />
    </div>
  );
}

export default Navbar;