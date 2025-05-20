import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = [
  "/images/pexels-bertellifotografia-799443.jpg",
  "/images/pexels-deepu-b-iyer-40465.jpg",
  "/images/pexels-eberhardgross-1366919.jpg",
  "/images/pexels-maxandrey-1366630.jpg",
  "/images/pexels-todd-trapani-488382-1535162.jpg",
];
export default function BackgroundCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {IMAGES.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
