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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="flex justify-center mb-6">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Address Skeleton */}
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription and Services Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-36 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-36 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Services Skeleton */}
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-2 h-2 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Info and Notes Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Skeleton */}
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Actions Skeleton */}
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
