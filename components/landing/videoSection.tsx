"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Create intersection observer to detect when video is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Play video when in view
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          // Pause video when out of view
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // When 50% of the video is visible
      }
    );

    // Start observing the video section
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Clean up observer on component unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 bg-black overflow-hidden"
      id="video"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Découvrez Notre Environnement
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Plongez dans l'atmosphère énergique de Tiger Gym Megrine et découvrez ce qui rend notre salle unique.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          {/* Video controls overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-30">
            <Button 
              variant="outline"
              size="icon"
              className="bg-black/50 border-white/30 hover:bg-black/70 text-white rounded-full w-12 h-12"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="outline"
                size="icon" 
                className="bg-black/50 border-white/30 hover:bg-black/70 text-white rounded-full w-10 h-10"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full">
                  Rejoignez-nous
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            muted
            loop
            playsInline
            poster="/images/video-poster.jpg" // Add a poster image
          >
            <source src="/videos/gym-promo.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-gray-400 italic">
            "Notre environnement est conçu pour vous motiver et vous pousser à donner le meilleur de vous-même à chaque séance."
          </p>
        </div>
      </div>
    </section>
  );
}