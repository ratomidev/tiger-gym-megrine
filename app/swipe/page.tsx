"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

export default function SwipePage() {
  const [activeIndex, setActiveIndex] = useState(0);
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
    },  ];  return (
    <div className="max-w-md mx-auto py-8">
      
      {/* Main Story Viewer */}
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">        <Swiper
          modules={[A11y, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={activeIndex}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="story-swiper"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id}>
              <div className="relative h-[70vh] max-h-[600px]">
                {/* Story image */}
                <div className="relative w-full h-full">
                  <Image 
                    src={story.storyImage} 
                    alt={`Story ${story.id}`} 
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    priority
                  />
                </div>
              </div>
            </SwiperSlide>          ))}
        </Swiper>
      </div>
    </div>
  );
}