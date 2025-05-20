"use client";
import React from "react";
import { getFirestore } from "firebase/firestore";
import { Toaster } from "sonner";
import { RegisterForm } from "./RegisterForm";





export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">New in RYX </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials and start your journey with us
          </p>
        </div>
        <RegisterForm className="space-y-4" />
      </div>
    </div>
  );
}
