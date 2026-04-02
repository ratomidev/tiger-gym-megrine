"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-6xl px-4 mx-auto pt-6 overflow-x-hidden flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Header matching page.tsx */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6 shrink-0">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="w-full sm:w-40 h-10" />
      </div>

      {/* Main content matching AdherentTable structure */}
      <div className="flex flex-col flex-1 min-h-0 w-full">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
          <Skeleton className="h-4 w-32 hidden sm:block" />
        </div>

        {/* Table Container */}
        <div className="rounded-md border w-full flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
          {/* Table Header */}
          <div className="h-10 border-b bg-muted/50 px-4 flex items-center shrink-0">
            <Skeleton className="h-4 w-[250px] mr-4" />
            <Skeleton className="h-4 w-[100px] mr-4 hidden sm:block" />
            <Skeleton className="h-4 w-[180px] mr-4 hidden md:block" />
            <Skeleton className="h-4 w-[150px] mr-4 shrink-0 hidden lg:block" />
            <Skeleton className="h-4 w-[100px] mr-4" />
            <Skeleton className="h-4 w-[130px] mr-auto hidden xl:block" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>

          {/* Table Body */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center h-16 px-4 border-b last:border-0 shrink-0">
                <div className="flex items-center gap-3 w-[250px] mr-4 shrink-0">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[100px] mr-4 hidden sm:block shrink-0" />
                <Skeleton className="h-4 w-[180px] mr-4 hidden md:block shrink-0" />
                <div className="flex flex-col gap-2 w-[150px] mr-4 shrink-0 hidden lg:block">
                  <Skeleton className="h-4 w-[90px]" />
                  <Skeleton className="h-3 w-[60px]" />
                </div>
                <Skeleton className="h-6 w-[80px] rounded-full mr-4 shrink-0" />
                <Skeleton className="h-4 w-[130px] mr-auto shrink-0 hidden xl:block" />
                <Skeleton className="h-8 w-8 rounded-md ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Container */}
        <div className="flex items-center justify-center mt-auto pt-4 shrink-0 pb-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px] rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md hidden sm:block" />
            <Skeleton className="h-10 w-10 rounded-md hidden sm:block" />
            <Skeleton className="h-10 w-10 rounded-md hidden sm:block" />
            <Skeleton className="h-10 w-[100px] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
