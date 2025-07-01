// components/auth/SessionCheck.tsx
"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Time in milliseconds to check session (every 5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

export function SessionCheck() {
  const router = useRouter();
  const { logout } = useAuth();

  // Check session validity
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check-session");
      
      if (!res.ok) {
        // Session expired or invalid
        toast.error("Your session has expired. Please log in again.");
        logout();
        router.push("/auth/login?expired=true");
      }
    } catch (error) {
      console.error("Session check failed", error);
    }
  }, [logout, router]);
  
  useEffect(() => {
    // Check session on component mount
    checkSession();
    
    // Set up interval to check session
    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL);
    
    return () => {
      clearInterval(interval);
    };
  }, [checkSession]);
  
  return null; // This component doesn't render anything
}