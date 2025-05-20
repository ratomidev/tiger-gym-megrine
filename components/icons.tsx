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
};
