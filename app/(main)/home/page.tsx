"use client";
import RevenueSection from "@/components/dashboard/RevenueSection";
import AdherentOverviewSection from "@/components/dashboard/AdherentOverviewSection";

export default function HomePage() {
  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        <div className="@container/main flex flex-1 flex-col">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <RevenueSection />
            <AdherentOverviewSection />
          </div>
        </div>
      </div>
    </div>
  );
}
