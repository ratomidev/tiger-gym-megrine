"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, Github, Phone } from "lucide-react";
import Image from "next/image";

// Define Icons using Lucide React
const Icons = {
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
};

// Define the props interface for UserAuthForm
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
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
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>
          <Button className="mt-2" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log In
          </Button>
        </div>
      </form>
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
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.phone className="mr-2 h-4 w-4" />
        )}{" "}
        Phone
      </Button>
    </div>
  );
}

// Add default export for Next.js page
export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back to RYX</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
