import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function AppCarousel() {
  return (
    <Carousel 
      className="w-full h-full max-w-md mx-auto" 
      opts={{ 
        duration: 20, 
        loop: true,
        skipSnaps: false, // Prevent skipping positions
        dragFree: false , // Ensures it snaps to positions exactly
        dragThreshold: 0, // No drag threshold
     
       
        
      }}
    >
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="p-1 h-full">
              <Card className="h-full flex flex-col">
              <CardHeader>
                    <CardTitle>Toumi Rami</CardTitle>
                    <CardDescription>no way for life</CardDescription>
              </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-6">
                  <div className="h-[500px] w-full flex items-center justify-center bg-muted rounded-lg md-bg-black">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious />
      </div>
      <div className="hidden sm:block">
        <CarouselNext />
      </div>
    </Carousel>
  )
}
