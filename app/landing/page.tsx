"use client";

import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import BackgroundCarousel from "@/components/landing/background-carousel";
import ProgramsList from "@/components/landing/programs-list";
import VideoSection from "@/components/landing/videoSection";
import AboutSection from "@/components/landing/aboutSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero section with background */}
      <div className="relative overflow-hidden">
        <BackgroundCarousel />
        <div className="absolute inset-0 bg-black/50 z-5"></div>
        
        {/* Navigation */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Hero Content */}
        <HeroSection />
      </div>
      
      {/* Video section */}
      <VideoSection />
      
      {/* Programs section */}
      <ProgramsList />
      
      {/* About section */}
      <AboutSection />
    </div>
  );
}
