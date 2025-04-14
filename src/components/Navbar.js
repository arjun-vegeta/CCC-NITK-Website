"use client";
import React from "react";
import { cn } from "../utils/cn.js";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";  // Importing search icon

function Navbar({ className }) {
  return (
    <div className={cn("w-full  top-0 z-50 bg-white border-b border-gray-300 ", className)}>

      {/* 🔝 Top Row: Controls */}
      {/* <div className="flex items-center justify-between px-6 py-2 text-sm bg-gray-100">
        <div>
          <button className="text-xl cursor-pointer">🌙</button>
        </div>
        <div>
          <button className="border px-2 py-1 rounded">EN / हि</button>
        </div>
      </div> */}

      {/* 🔻 Bottom Row: Logo + Search + Nav */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">

        {/* Left: Enlarged Logo */}
        <div className="flex items-center h-24 cursor-pointer">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="NITK Logo" className="w-20 h-20 object-scale-down" />
            <div className="ml-3 text-sm">
              <h6 className="font-bold text-gray-800 text-sm lg:text-base">National Institute of Technology Karnataka</h6>
              <h1 className="font-black text-3xl text-gray-900">CCC</h1>
            </div>
          </Link>
        </div>

        {/* Center: Smaller Rounded Search Bar with Search Icon */}
        <div className="flex justify-center w-[30%]">
          <div className="flex items-center border border-gray-300 rounded-full w-full">
            <FiSearch className="text-gray-500 ml-4" />
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 w-full rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center space-x-6">
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
    </div>
  );
}

export default Navbar;
