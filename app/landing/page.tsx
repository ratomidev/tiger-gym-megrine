"use client";

import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import BackgroundCarousel from "@/components/ui/background-carousel";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundCarousel />
      <Navbar />
      <HeroSection />
    </div>
  );
}
