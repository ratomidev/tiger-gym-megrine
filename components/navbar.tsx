"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenu from "./mobile-menu";
import { Menu } from "lucide-react"; // Import hamburger icon

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <nav className="relative z-10 flex items-center justify-between p-6 bg-transparent">
      <div className="text-white text-2xl font-bold">Ryx</div>

      {isMobile ? (
        <>
          <button
            className="text-white p-2 focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <Menu size={24} /> {/* Visible hamburger icon */}
          </button>

          {open && (
            <MobileMenu
              open={open}
              onToggle={() => setOpen((o) => !o)}
              links={LINKS}
              onNavigate={handleNavigate}
            />
          )}
        </>
      ) : (
        <div className="flex space-x-6">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white hover:text-gray-300 transition"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
