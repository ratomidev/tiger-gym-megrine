"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

interface MobileMenuProps {
  open: boolean;
  onToggle: () => void;
  links: { label: string; href: string }[];
}

export default function MobileMenu({ open, onToggle, links }: MobileMenuProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleNavigate = (href: string) => {
    onToggle();
    router.push(href);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  return (
    <div
      ref={ref}
      className="absolute top-16 right-6 w-56 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 z-50 overflow-hidden"
    >
      {links.map(({ href, label }) => (
        <button
          key={href}
          onClick={() => handleNavigate(href)}
          className="block w-full text-white text-left px-4 py-3 hover:bg-white/20  "
        >
          {label}
        </button>
      ))}
    </div>
  );
}
