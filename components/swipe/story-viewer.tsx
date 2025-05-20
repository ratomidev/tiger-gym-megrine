"use client";

/**
 * # StoryViewer Component
 *
 * A React component that provides an Instagram-like story viewing experience.
 *
 * ## Basic Usage
 * ```tsx
 * const stories = [
 *   { id: 1, storyImage: "/images/image1.jpg", seen: false },
 *   { id: 2, storyImage: "/images/image2.jpg", seen: true },
 * ];
 *
 * <StoryViewer stories={stories} />
 * ```
 *
 * @param props.stories - Array of story objects to display
 * @param [props.initialIndex=0] - Index of the story to display first
 */

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";

export interface Story {
  id: number | string;
  storyImage: string;
  seen?: boolean;
  // Add other properties as needed (caption, date, etc.)
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
}

export function StoryViewer({ stories, initialIndex = 0 }: StoryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperType | null>(null);

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
    <div
      className={`overflow-hidden h-[94vh] w-[94%] md:w-[375px] lg:w-[425px] xl:w-[475px] mx-auto shadow-xl relative rounded-xl`}
    >
      <Swiper
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
      >
        {stories.map((story) => (
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
                />
              </div>

              {/* Left navigation area */}
              <div
                className="absolute top-1 left-1 w-[calc(50%-2px)] h-[calc(100%-2px)] z-10 cursor-pointer"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                <div className="absolute top-1/2 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-70 transition-opacity -translate-y-1/2">
                  ←
                </div>
              </div>

              {/* Right navigation area */}
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
        ))}
      </Swiper>

      {/* Story counter indicator */}
      <div className="absolute bottom-5 right-5 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
        {activeIndex + 1}/{stories.length}
      </div>
    </div>
  );
}
