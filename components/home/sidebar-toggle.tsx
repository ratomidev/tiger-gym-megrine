"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";

export function SidebarToggle() {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleSidebar}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </Button>
  );
}