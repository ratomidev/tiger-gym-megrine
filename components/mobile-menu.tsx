"use client";

import { useRef, useEffect } from "react";

interface MobileMenuProps {
  open: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
  links: { label: string; href: string }[];
}

export default function MobileMenu({
  open,
  onToggle,
  onNavigate,
  links,
}: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onToggle]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute top-16 right-6 w-56 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 z-50 overflow-hidden"
    >
      {links.map(({ href, label }) => (
        <button
          key={href}
          onClick={() => onNavigate(href)}
          className="block w-full text-white text-left px-4 py-3 hover:bg-white/20 transition"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
