// src/pages/Home.js
import React from "react";
import HeroSection from "../components/homepage/HeroSection";
import SecondHeroSection from "../components/homepage/SecondHeroSection";
import GuideSection from "../components/homepage/GuideSection";
import FacilityInfo from "../components/homepage/HomeFacilityInfo";

function Home() {
  return (
    // Main container: relative, overflow-hidden, and a fallback background
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f5] dark:bg-[#0b0c10]">
      
      {/* Decorative Gradient Blobs Container */}
      {/* This container holds the blobs and has a base opacity */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-40">
        
        {/* Light Mode Gradient Blobs */}
        <div className="hidden dark:hidden"> {/* Only show these in light mode */}
          <div 
            className="absolute top-[-25%] left-[-25%] w-[50rem] h-[50rem] bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '8s' }} // Slower pulse
          ></div>
          <div 
            className="absolute bottom-[-30%] right-[-30%] w-[45rem] h-[45rem] bg-gradient-to-r from-green-200 via-teal-200 to-cyan-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '-3s', animationDuration: '9s' }} // Offset and different speed
          ></div>
          <div 
            className="absolute top-[5%] right-[0%] w-[35rem] h-[35rem] bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '-5s', animationDuration: '7s' }} // Offset and different speed
          ></div>
        </div>
        
        {/* Dark Mode Gradient Blobs */}
        <div className="dark:block hidden"> {/* Only show these in dark mode */}
          <div 
            className="absolute top-[-25%] left-[-25%] w-[50rem] h-[50rem] bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 rounded-full opacity-50 blur-3xl animate-pulse"
            style={{ animationDuration: '8s' }}
          ></div>
          <div 
            className="absolute bottom-[-30%] right-[-30%] w-[45rem] h-[45rem] bg-gradient-to-r from-green-700 via-teal-800 to-cyan-900 rounded-full opacity-50 blur-3xl animate-pulse"
            style={{ animationDelay: '-3s', animationDuration: '9s' }}
          ></div>
          <div 
            className="absolute top-[5%] right-[0%] w-[35rem] h-[35rem] bg-gradient-to-r from-purple-700 via-pink-800 to-red-900 rounded-full opacity-40 blur-3xl animate-pulse"
            style={{ animationDelay: '-5s', animationDuration: '7s' }}
          ></div>
        </div>
      </div>

      {/* Page Content Wrapper */}
      {/* This ensures your content is above the gradient blobs and retains padding */}
      <div className="relative z-10 p-4">
        <HeroSection />
        <SecondHeroSection />
        <FacilityInfo />
        <GuideSection />
      </div>
    </div>
  );
}

export default Home;