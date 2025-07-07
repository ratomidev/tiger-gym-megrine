"use client";

import { Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import React from "react";

interface SocialContactsProps {
  className?: string;
  iconSize?: string;
  showLabels?: boolean;
}

export default function SocialContacts({
  className = "",
  iconSize = "w-6 h-6",
  showLabels = false,
}: SocialContactsProps) {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/tiger.gym.megrine/",
      color: "text-pink-500",
      hoverColor: "hover:text-pink-400",
      bgColor: "hover:bg-pink-500/20",
      isImage: false,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61573911387157",
      color: "text-blue-600",
      hoverColor: "hover:text-blue-500",
      bgColor: "hover:bg-blue-500/20",
      isImage: false,
    },
    {
      name: "TikTok",
      icon: "/icons/tik-tok.png",
      url: "https://www.tiktok.com/@tiger.gym.megrine",
      color: "text-red-500",
      hoverColor: "hover:text-red-400",
      bgColor: "hover:bg-red-500/20",
      isImage: true,
    },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map((social) => {
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center gap-3 p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${social.bgColor}`}
          >
            <div className={`${iconSize} transition-colors duration-300`}>
              {social.isImage ? (
                <Image
                  src={social.icon as string}
                  alt={social.name}
                  width={24}
                  height={24}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              ) : (
                <div className={`${social.color} ${social.hoverColor}`}>
                  {React.createElement(
                    social.icon as React.ComponentType<{ className: string }>,
                    {
                      className: "w-full h-full",
                    }
                  )}
                </div>
              )}
            </div>

            {showLabels && (
              <span
                className={`text-sm font-medium ${social.color} ${social.hoverColor} transition-colors duration-300`}
              >
                {social.name}
              </span>
            )}

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </a>
        );
      })}
    </div>
  );
}
