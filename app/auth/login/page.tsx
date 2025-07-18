"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  useEffect(() => {
    document.title = "Login - Tiger Gym";
  }, []);
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Get the callback URL if available
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  // Check if session expired
  const sessionExpired = searchParams.get("expired") === "true";

  // Show expired session message
  if (sessionExpired) {
    toast.error("Votre session a expiré. Veuillez vous reconnecter.");
  }

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
      toast.error("L'email et le mot de passe sont requis");
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
        throw new Error(data.error || "Échec de la connexion");
      }

      // Success - handle user login
      handleAuthSuccess(data.user);
    } catch (error) {
      handleAuthError(
        error instanceof Error ? error.message : "Échec de la connexion"
      );
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
    toast.success(`Connexion réussie, Bienvenue ${user.name || user.email} !`);

    // Delay navigation to allow toast to be seen
    setTimeout(() => {
      router.push(decodeURIComponent(callbackUrl));
    }, 1000);
  };

  /**
   * Handle authentication errors
   * - Shows error toast with message
   */
  const handleAuthError = (message: string) => {
    toast.error(`Échec de la connexion : ${message}`);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Tiger Gym Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Entrez vos identifiants pour vous connecter
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="votre.email@exemple.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isProcessing}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
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
              className="h-11 text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion en cours...</span>
              </div>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginForm />
      <Toaster position="top-right" />
    </Suspense>
  );
}
