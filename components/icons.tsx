"use client";

import { cn } from "@/lib/utils";
import { Loader2, Github, Phone, User, Mail, Lock } from "lucide-react";
import Image from "next/image";

export const Icons = {
  spinner: ({ className }: { className?: string }) => (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
  ),
  gitHub: ({ className }: { className?: string }) => (
    <Github className={cn("h-4 w-4", className)} />
  ),
  google: ({ className }: { className?: string }) => (
    <Image
      src="/icons/google.svg"
      alt="Google"
      width={16}
      height={16}
      className={cn("h-4 w-4", className)}
    />
  ),
  phone: ({ className }: { className?: string }) => (
    <Phone className={cn("h-4 w-4", className)} />
  ),
  user: ({ className }: { className?: string }) => (
    <User className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  email: ({ className }: { className?: string }) => (
    <Mail className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  lock: ({ className }: { className?: string }) => (
    <Lock className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  mapPin: ({ className }: { className?: string }) => (
    <svg
      className={cn("h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 10.5 8.5z" />
      <path d="M12 6a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 6z" />
    </svg>
  ),
};
