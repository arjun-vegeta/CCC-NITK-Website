"use client";
import React from "react";
import { cn } from "../utils/cn.js";
import { Link } from "react-router-dom";


export default function NavbarMain() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-0" />
      <p className="text-black dark:text-white mt-4"></p>
    </div>
  );
}

function Navbar({ className }) {

  return (
    <div className={cn("sticky top-0 w-full z-50 bg-white shadow-md", className)}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section: Logo & Title */}
        <div className="flex items-center h-24 p-1 cursor-pointer">
          <Link to="/" className="flex items-center">
            <img src="logo.png" alt="NITK Logo" className="object-scale-down w-20 h-20 lg:w-30 lg:h-30" />
            <div className="flex flex-col mt-2 ml-2 text-sm lg:text-base">
              <h6 className="font-bold text-gray-800">National Institute of Technology Karnataka</h6>
              <h1 className="font-black text-2xl lg:text-4xl text-gray-900">CCC</h1>
            </div>
            </Link>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="flex items-center space-x-6">
  <Link
    to="/howto"
    className="relative text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 hover:scale-105 
               after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-blue-500 
               after:transition-all after:duration-300 hover:after:w-full"
  >
    How To
  </Link>

  <Link
    to="/facilities"
    className="relative text-gray-600 transition duration-300 ease-in-out hover:text-green-600 hover:scale-105 
               after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-green-500 
               after:transition-all after:duration-300 hover:after:w-full"
  >
    Facilities
  </Link>

  <Link
    to="/policies"
    className="relative text-gray-600 transition duration-300 ease-in-out hover:text-red-600 hover:scale-105 
               after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-1 after:bg-red-500 
               after:transition-all after:duration-300 hover:after:w-full"
  >
    Policies
  </Link>
</div>

      </div>
    </div>
  );
}
