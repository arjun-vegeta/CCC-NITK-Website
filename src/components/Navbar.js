"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5"; // Using IoSearch icon

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // Toggle search modal visibility
  const [textOpacity, setTextOpacity] = useState(1);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const searchBarRef = useRef(null);
  const navLinksRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const topRowHeight = document.querySelector(".top-controls")?.clientHeight || 0;
      const earlyFadeOffset = 30;
      const fadeDistance = 50;
      const fadeStart = topRowHeight - earlyFadeOffset;
      const fadeEnd = fadeStart + fadeDistance;
      const scrollY = window.scrollY;

      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / fadeDistance);
      setTextOpacity(opacity);

      setIsSticky(scrollY > topRowHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => setShowSearch(!showSearch); // Toggle search bar visibility

  useEffect(() => {
    const transitionStyle = "opacity 0.3s ease-in-out";
    const transformStyle = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

    if (logoRef.current) {
      logoRef.current.style.transition = transitionStyle;
      logoRef.current.style.opacity = isSticky ? "0" : "1";
    }
    if (textRef.current) {
      textRef.current.style.transition = transitionStyle;
      textRef.current.style.opacity = isSticky ? "0" : "1";
    }
    if (searchBarRef.current) {
      searchBarRef.current.style.transition = transformStyle;
      searchBarRef.current.style.opacity = isSticky ? "0" : "1";
      searchBarRef.current.style.transform = isSticky ? "translateX(-50%)" : "translateX(0)";
    }
    if (navLinksRef.current) {
      navLinksRef.current.style.justifyContent = isSticky ? "center" : "flex-end";
    }
  }, [isSticky]);

  return (
    <div className="w-full top-0 z-50 bg-white border-b border-gray-300">

      {/* 🔝 Top Row: Controls (Uncommented for dark mode, language toggle) */}
      <div className="flex items-center justify-between px-6 py-2 text-sm bg-gray-100">
        <div>
          <button className="text-xl cursor-pointer">🌙</button>
        </div>
        <div>
          <button className="border px-2 py-1 rounded">EN / हि</button>
        </div>
      </div>

      {/* 🔻 Bottom Row: Logo + Search + Nav */}
      <div
        className={`w-full bg-white transition-all duration-300 ${isSticky ? "fixed top-0 left-0 right-0 z-[999] shadow-lg" : "shadow-md"}`}
      >
        <div className={`flex items-center px-6 transition-all duration-300 ${isSticky ? "py-2 justify-center" : "py-4 justify-between"}`}>
          
          {/* Logo area */}
          <div className={`flex items-center cursor-pointer ${isSticky ? "absolute left-6" : ""}`} ref={logoRef}>
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="NITK Logo"
                className={`object-scale-down transition-all duration-300 ${isSticky ? "w-20" : "w-24"}`}
              />
              <div
                className="ml-2 leading-tight transition-opacity duration-300"
                style={{ opacity: textOpacity }}
                ref={textRef}
              >
                <h1 className="font-bold text-gray-800 text-xl">National Institute of Technology Karnataka</h1>
                <h1 className="font-black text-gray-900 text-3xl">CCC</h1>
              </div>
            </Link>
          </div>

          {/* Search bar center (only non-sticky mode) */}
          {!isSticky && (
            <div className="flex justify-center w-[300px]" ref={searchBarRef}>
              <div className="flex items-center border border-gray-300 rounded-full w-full">
                <IoSearch className="text-gray-500 ml-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-2 w-full rounded-full text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Center: Smaller Rounded Search Bar with Search Icon (Modal triggered by toggle) */}
          <div className="flex justify-center w-[30%]">
            <div className="flex items-center border border-gray-300 rounded-full w-full">
              <IoSearch className="text-gray-500 ml-4" />
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 w-full rounded-full text-sm focus:outline-none"
                onClick={toggleSearch} // Modal toggle
              />
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex items-center space-x-6" ref={navLinksRef}>
            <Link
              to="/network-guides"
              className="font-semibold text-[#192F59] hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all"
            >
              Network Guides
            </Link>
            <Link
              to="/facilities"
              className="font-semibold text-[#192F59] hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all"
            >
              Facilities
            </Link>
            <Link
              to="/about"
              className="font-semibold text-[#192F59] hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="font-semibold text-[#192F59] hover:text-[#0FA444] hover:border-b-2 hover:border-[#0FA444] transition-all"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Spacer to prevent layout shift */}
        {isSticky && (
          <div
            style={{
              height: document.querySelector(".top-controls + div")?.clientHeight || "0px",
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
