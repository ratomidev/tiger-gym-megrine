"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { EmailPasswordForm } from "./components/EmailPasswordForm";
import  GoogleAuthButton  from "./components/GoogleAuthButton";
// import { GoogleAuthButton } from "./components/GoogleAuthButton";
import { PhoneAuthButton } from "./components/PhoneAuthButton";
import { PhoneAuthForm } from "./components/PhoneAuthForm";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const [authMethod, setAuthMethod] = React.useState<"email" | "phone" | null>("email");

  const handleAuthSuccess = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Welcome back! " + user.displayName);
    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  const handleAuthError = (message: string) => {
    toast.error(message);
  };

  const handlePhoneAuthClick = () => {
    setAuthMethod("phone");
  };

  // Cancel phone auth and go back to email login
  const handleCancelPhoneAuth = () => {
    setAuthMethod("email");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {authMethod === "email" ? (
        <>
          <EmailPasswordForm 
            onSuccess={handleAuthSuccess}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleAuthButton 
            onSuccess={handleAuthSuccess} 
            onError={handleAuthError} 
          />
          <PhoneAuthButton onClick={handlePhoneAuthClick} />
        </>
      ) : (
        <PhoneAuthForm
          onSuccess={handleAuthSuccess}
          onError={handleAuthError}
          onCancel={handleCancelPhoneAuth}
        />
      )}
    </div>
  );
}
