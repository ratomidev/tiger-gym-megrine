"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/home/mode-toggle";
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
        <header className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2">
            {/* <CommandPalette /> */}
            <ModeToggle />
            {/* <UserAuthButton /> */}
          </div>
        </header>

        <aside>
          <SidebarNavigation />
        </aside>

        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
          <div className="w-full h-screen pt-20">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
