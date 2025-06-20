"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="w-full bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center py-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[110px] ml-auto" />
          </div>
          <div className="rounded-md border">
            <div className="h-10 px-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center h-full">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-4 w-full mx-2" />
                ))}
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center h-16 px-4 border-t">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-4 w-full mx-2" />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end space-x-2 py-4 mt-4">
            <Skeleton className="h-4 w-64 mr-auto" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
