"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/home/sidebar-navigation";
import { useState, useEffect } from "react";
// import { UserAuthButton } from "@/components/user-auth-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1090) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* Header removed - theme toggle moved to sidebar dropdown */}

        <aside>
          <SidebarNavigation />
        </aside>

        <main className="flex-1 min-w-0 relative">
          <div className="w-full pt-4 px-4 z-50 bg-background">
            <SidebarTrigger />
          </div>
          <div className="w-full h-[calc(100vh-theme(spacing.16))]">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
