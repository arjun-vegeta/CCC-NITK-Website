import React, { useEffect } from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import HeroSection from "../components/homepage/HeroSection";
import SecondHeroSection from "../components/homepage/SecondHeroSection";
import GuideSection from "../components/homepage/GuideSection";
import FacilityInfo from "../components/homepage/HomeFacilityInfo";

function Home() {
  const { darkMode } = useDarkMode();

  // Add CSS for fixed background that works on mobile
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .home-container {
        position: relative;
        z-index: 1;
      }
      
      .home-container::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: var(--bg-image);
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        z-index: -1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Set the background image variable based on theme
  // useEffect(() => {
  //   document.documentElement.style.setProperty(
  //     '--bg-image', 
  //     `url('${!darkMode ? '/Header-background-light.svg' : '/Header-background-dark.svg'}')`
  //   );
  // }, [darkMode]);
  // Comment out the background SVG for now
  // useEffect(() => {
  //   document.documentElement.style.setProperty(
  //     '--bg-image', 
  //     `url('${!darkMode ? '/Header-background-light.svg' : '/Header-background-dark.svg'}')`
  //   );
  // }, [darkMode]);

  return (
    <div 
      key={darkMode ? 'dark' : 'light'}
      className="p-4 bg-[#f5f5f5] dark:bg-[#0b0c10] transition-all duration-300 home-container"
    >
      <HeroSection />
      <SecondHeroSection />
      <FacilityInfo />
      <GuideSection />
    </div>
  );
}

export default Home;