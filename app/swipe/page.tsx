"use client";

import { StoryViewer } from "@/components/swipe/story-viewer";

export default function SwipePage() {
  // Stories data with images
  const stories = [
    {
      id: 1,
      storyImage: "/images/pexels-bertellifotografia-799443.jpg",
      seen: false,
    },
    {
      id: 2,
      storyImage: "/images/pexels-deepu-b-iyer-40465.jpg",
      seen: false,
    },
    {
      id: 3,
      storyImage: "/images/pexels-eberhardgross-1366919.jpg",
      seen: true,
    },
    {
      id: 4,
      storyImage: "/images/pexels-maxandrey-1366630.jpg",
      seen: false,
    },
    {
      id: 5,
      storyImage: "/images/pexels-todd-trapani-488382-1535162.jpg",
      seen: true,
    },
  ]; // Navigation handlers
  return (
    <div className="h-screen w-full flex items-center justify-center p-0">
      <StoryViewer stories={stories} />
    </div>
  );
}
