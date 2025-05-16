"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { toast, Toaster } from "sonner";


const db = getFirestore();

const Icons = {
  spinner: ({ className }: { className?: string }) => (
    <div className={cn("animate-spin h-4 w-4", className)}>⏳</div>
  ),
  google: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  ),
  user: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 text-gray-400", className)}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  email: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 text-gray-400", className)}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  lock: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 text-gray-400", className)}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  phone: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 text-gray-400", className)}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

interface UserSigninFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function UserSigninForm({ className, ...props }: UserSigninFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
};


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password

      );
      const user = userCredential.user;

      // You could store extra info like firstname/lastname in Firestore if needed
      console.log("User:", user);

      toast.success(" created successUserfully!");

    } catch (error: any) {
        toast.error("Error creating user: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }; 
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="firstname">First Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icons.user />
              </div>
              <Input
                id="firstname"
                placeholder="John"
                type="text"
                className="pl-10"
                autoCapitalize="words"
                autoComplete="given-name"
                autoCorrect="off"
                disabled={isLoading}
                required
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-2 flex-1">
            <Label htmlFor="lastname">Last Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icons.user />
              </div>
              <Input
                id="lastname"
                placeholder="Doe"
                className="pl-10"
                type="text"
                autoCapitalize="words"
                autoComplete="family-name"
                autoCorrect="off"
                disabled={isLoading}
                required
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-2 mt-4">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.email />
            </div>
            <Input
              id="email"
              placeholder="name@example.com"
              className="pl-10"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
                value={formData.email}
                onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid gap-2 mt-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.lock />
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              className="pl-10"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
              value={formData.password}
                onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid gap-2 mt-4">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.phone />
            </div>
            <Input
              id="phone"
              placeholder="+216 XX XXX XXX"
              className="pl-10"
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="mt-3 text-xs text-gray-500 text-center">
            By creating an account, you agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>. We'll occasionally send you account-related emails.
          </p>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or register with
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
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
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.phone className="mr-2 h-4 w-4" />
          )}{" "}
          Phone
        </Button>
      </div>
    </div>
  );
}

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
        <UserSigninForm className="space-y-4" />
      </div>
    </div>
  );
}
