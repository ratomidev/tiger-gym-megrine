"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { User } from "@/lib/auth/types";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();

  const handleAuthSuccess = (user: User) => {
    login(user);
    toast.success("Welcome back! " + (user.name || user.email));
    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  const handleAuthError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <EmailPasswordForm 
        onSuccess={handleAuthSuccess} 
        onError={handleAuthError} 
      />
    </div>
  );
}
