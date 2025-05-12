"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

export default function SwipePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Check viewport width on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
    
  // Stories data with images
  const stories = [
    {
      id: 1,
      storyImage: '/images/pexels-bertellifotografia-799443.jpg',
      seen: false,
    },
    {
      id: 2,
      storyImage: '/images/pexels-deepu-b-iyer-40465.jpg',
      seen: false,
    },
    {
      id: 3,
      storyImage: '/images/pexels-eberhardgross-1366919.jpg',
      seen: true,
    },
    {
      id: 4,
      storyImage: '/images/pexels-maxandrey-1366630.jpg',
      seen: false,
    },
    {
      id: 5,
      storyImage: '/images/pexels-todd-trapani-488382-1535162.jpg',
      seen: true,
    },  
  ];  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);
  
  const handleNext = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);
    return (
    <div className="h-screen w-full flex items-center justify-center p-0">
      {/* Main Story Viewer */}
      <div className={`overflow-hidden h-[94vh] ${isMobile ? 'w-[94%] mx-auto' : 'w-[375px] md:w-[425px] lg:w-[475px]'} mx-auto shadow-xl relative rounded-xl`}>        <Swiper
          modules={[A11y]}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={activeIndex}
          loop={true}
          loopAdditionalSlides={1}
          speed={300}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-full w-full"
        >          {stories.map((story) => (
            <SwiperSlide key={story.id}>
              <div className="relative h-full w-full p-1">
                {/* Story image */}
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image 
                    src={story.storyImage} 
                    alt={`Story ${story.id}`} 
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 475px"
                    priority
                  />                </div>
                
                {/* Left navigation area - previous */}                <div 
                  className="absolute top-1 left-1 w-[calc(50%-2px)] h-[calc(100%-2px)] z-10 cursor-pointer" 
                  onClick={handlePrev}
                  aria-label="Previous story"
                >
                  <div className="absolute top-1/2 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-70 transition-opacity -translate-y-1/2">
                    ←
                  </div>
                </div>
                
                {/* Right navigation area - next */}
                <div 
                  className="absolute top-1 right-1 w-[calc(50%-2px)] h-[calc(100%-2px)] z-10 cursor-pointer" 
                  onClick={handleNext}
                  aria-label="Next story"
                >
                  <div className="absolute top-1/2 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-70 transition-opacity -translate-y-1/2">
                    →
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}        </Swiper>
        
        {/* Story counter indicator */}
        <div className="absolute bottom-5 right-5 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
          {activeIndex + 1}/{stories.length}
        </div>
      </div>
    </div>
  );
}