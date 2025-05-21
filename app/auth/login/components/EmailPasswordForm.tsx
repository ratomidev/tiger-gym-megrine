"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { sign } from "crypto";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import React from "react";
import { toast } from "sonner";

interface EmailPasswordFormProps {
  onSuccess: (user: User) => void;
  onError?: (message: string) => void;
}

export function EmailPasswordForm({
  onSuccess,
  onError,
}: EmailPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("welcome back! " + user.displayName);
      onSuccess(user);
    } catch (error) {
      let message = "login failed. please try again";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          message = "Invalid email or password";
        } else if (error.code === "auth/user-not-found") {
          message = "No account found with this email";
        } else if (error.code === "auth/wrong-password") {
          message = "Incorrect password";
        } else if (error.code === "auth/too-many-requests") {
          message = "Too many failed login attempts. Please try again later.";
        } else if (error.code === "auth/user-disabled") {
          message = "This account has been disabled. Please contact support.";
        }
      }
      setErrorMessage(message);
      if (onError) {
        onError(message);
      }
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            required
          />
          </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
            required
          />
        </div>
        <Button className="mt-2" disabled={isLoading} type="submit">
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Log In
        </Button>
      </div>
    </form>
  )
}
