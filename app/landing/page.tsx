"use client";

import HeroSection from "@/components/landing/hero-section";
import Navbar from "@/components/landing/navbar";
import BackgroundCarousel from "@/components/landing/background-carousel";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundCarousel />
      <Navbar />
      <HeroSection />
    </div>
  );
}
