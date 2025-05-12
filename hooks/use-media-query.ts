"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const handleChange = () => {
      setMatches(media.matches);
    };
    
    // Set initial value
    setMatches(media.matches);
    
    // Add listener for changes
    media.addEventListener("change", handleChange);
    
    // Clean up
    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
