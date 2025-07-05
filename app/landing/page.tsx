"use client";

import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import BackgroundCarousel from "@/components/landing/background-carousel";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with overlay */}
      <BackgroundCarousel />
      <div className="absolute inset-0 bg-black/50 z-5"></div>

      {/* Navigation */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Hero Content */}
      <HeroSection />
    </div>
  );
}
