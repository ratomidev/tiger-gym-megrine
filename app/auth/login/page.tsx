// app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { User } from "@/lib/auth/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  /**
   * Handle form submission
   * - Validates inputs
   * - Calls login API
   * - Handles success/error responses
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      // Success - handle user login
      handleAuthSuccess(data.user);
    } catch (error) {
      handleAuthError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle successful authentication
   * - Updates auth context
   * - Shows success toast
   * - Redirects to home page
   */
  const handleAuthSuccess = (user: User) => {
    login(user);
    toast.success("Welcome back! " + (user.name || user.email));

    // Delay navigation to allow toast to be seen
    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  /**
   * Handle authentication errors
   * - Shows error toast with message
   */
  const handleAuthError = (message: string) => {
    toast.error(`Login failed: ${message}`);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Tiger Gym Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="your.email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isProcessing}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
