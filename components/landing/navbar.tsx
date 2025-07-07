"use client";

import { useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenu from "./mobile-menu";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

const LINKS = [
  { label: "Accueil", href: "/landing" },
  { label: "S'inscrire", href: "/register" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <nav className="relative flex items-center justify-between p-6">
      <div className="text-white text-2xl font-bold">
        <span className="text-red-500">TIGER</span> GYM
      </div>

      {isMobile ? (
        <>
          <button
            className="text-white p-2 "
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {isMenuOpen && (
            <MobileMenu
              open={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              links={LINKS}
            />
          )}
        </>
      ) : (
        <div className="flex space-x-6">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
