"use client";

import { useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenu from "./mobile-menu";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <nav className="relative flex items-center justify-between p-6">
      <div className="text-white text-2xl font-bold">Ryx</div>

      {isMobile ? (
        <>
          <button className="text-white p-2 " onClick={() => setOpen(!open)}>
            {open ? <XIcon /> : <MenuIcon />}
          </button>

          {open && (
            <MobileMenu
              open={open}
              onToggle={() => setOpen(!open)}
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
              className="text-white hover:text-gray-300 "
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
