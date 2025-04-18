import React from "react";
import HeroSection from "../components/homepage/HeroSection";
import SecondHeroSection from "../components/homepage/SecondHeroSection";
import GuideSection from "../components/homepage/GuideSection";
import FacilityInfo from "../components/homepage/HomeFacilityInfo";

function Home() {
  return (
    <div className="p-4 bg-[#f5f5f5] dark:bg-[#0b0c10]">
      <HeroSection />
      <SecondHeroSection />
      <FacilityInfo />
      <GuideSection />
    </div>
  );
}

export default Home;