import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SecondHeroSection from "../components/SecondHeroSection";
import GuideSection from "../components/GuideSection";

function Home() {
  return (
    <div className="p-4">
      <HeroSection />
      <SecondHeroSection />
      <GuideSection />
    </div>
  );
}

export default Home;