import { useEffect, useState } from "react";
import Image from "next/image";

// Using gym-themed stock images or your provided images
const IMAGES = [
  "/images/photo3v3.png",
  "/images/photo1.jpg",
  "/images/photo2v3.png",
];

export default function BackgroundCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000); // Slower transition for better UX
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {IMAGES.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1500 ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Ambiance gym ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
