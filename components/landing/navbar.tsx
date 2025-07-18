"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const LINKS = [
  { label: "Accueil", href: "/landing#home" },
  { label: "Abonnements", href: "/landing#plans" },
  { label: "À propos", href: "/landing#about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="relative flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-0">
        <div className="rounded-lg  justify-center ">
          <Image
            src="/images/logo.png"
            alt="Tiger Gym Logo"
            width={400}
            height={400}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="">
          <h1 className="text-xl font-bold text-white">TIGER GYM</h1>
          <p className="text-xs text-red-400">MEGRINE</p>
        </div>
      </div>
      {isMobile ? (
        <>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-400 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="md:hidden bg-black/95 backdrop-blur-sm border-t border-red-900/20 absolute top-15 left-0 right-0 w-full z-50"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className="text-white hover:text-red-400 transition-colors py-4"
                  >
                    {label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white mt-4 w-full"
                >
                  <Link href="/register" onClick={closeMobileMenu}>
                    Rejoindre
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
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
          <Button
            asChild
            className="hidden md:block bg-red-600 hover:bg-red-700 text-white"
          >
            <Link href="/register">Rejoindre</Link>
          </Button>
        </>
      )}
    </nav>
  );
}
