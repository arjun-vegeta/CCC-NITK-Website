import React from "react";
import HeroSection from "../components/HeroSection";
import SecondHeroSection from "../components/SecondHeroSection";
import GuideSection from "../components/GuideSection";
import FacilityInfo from "../components/HomeFacilityInfo";

function Home() {
  return (
    <div className="p-4 bg-[#f5f5f5]">
      <HeroSection />
      <SecondHeroSection />
      <FacilityInfo />
      <GuideSection />
    </div>
  );
}

export default Home;