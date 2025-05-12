"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

export function useSidebarAdjustment() {
  const { state } = useSidebar();
  const [adjustment, setAdjustment] = useState("0px");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    // Only apply sidebar adjustment on desktop devices
    if (!isDesktop) {
      setAdjustment("0px");
      return;
    }

    // When sidebar is expanded, we need to adjust the center point
    // The SIDEBAR_WIDTH constant is typically "16rem" as seen in the codebase
    if (state === "expanded") {
      // Move the chart to the right by half the sidebar width to center it in the remaining space
      setAdjustment("8rem"); // Half of 16rem
    } else {
      setAdjustment("0px");
    }
  }, [state, isDesktop]);

  return adjustment;
}
