"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    "/images/pexels-bertellifotografia-799443.jpg",
    "/images/pexels-deepu-b-iyer-40465.jpg",
    "/images/pexels-eberhardgross-1366919.jpg",
    "/images/pexels-maxandrey-1366630.jpg",
    "/images/pexels-todd-trapani-488382-1535162.jpg",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 w-full p-6 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Ryx</div>
        <div className="flex space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] text-white text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Ryx</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl">
          Discover a new way to connect, share, and explore with our platform
        </p>
        <div className="flex space-x-4">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition"
          >
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
}

// Navigation Link Component
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-white font-medium hover:text-gray-300 transition"
    >
      {children}
    </Link>
  );
}
