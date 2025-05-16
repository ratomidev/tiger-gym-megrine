"use client";

import { BarChartComponent } from "@/components/charts/barchart";
import { CommandPalette } from "@/components/command-palette";
import { ModeToggle } from "@/components/mode-toggle";
import { useSidebarAdjustment } from "@/hooks/use-sidebar-adjustment";

export default function Home() {
  const sidebarAdjustment = useSidebarAdjustment();
  return (
    <div className="relative h-full w-full">
      {/* Main content container with BarChartComponent fixed at top center */}
      <div className="h-screen w-full flex flex-col pt-16 items-center transition-all duration-300">
        {/* Bar chart positioned at the top center with compensation for sidebar */}
        <div
          className="fixed top-16 transform -translate-x-1/2 z-40 w-[95%] sm:w-auto transition-all ease-in-out duration-300"
          style={{
            left: `calc(50% + ${sidebarAdjustment})`,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          <BarChartComponent />
        </div>
        {/* Space for other content below the chart */}
        <div className="mt-64 w-full flex items-center justify-center">
          {/* Additional page content can go here */}
        </div>
      </div>{" "}
      {/* CommandAll positioned in the top right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2">
          <CommandPalette />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
