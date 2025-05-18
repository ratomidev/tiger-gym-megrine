"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { Loader2, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { setDoc, doc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of Tunisian states/governorates
const tunisianStates = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès",
  "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili",
  "Kef", "Mahdia", "Manouba", "Médenine", "Monastir",
  "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

const Icons = {
  spinner: ({ className }: { className?: string }) => (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
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
  user: ({ className }: { className?: string }) => (
    <User className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  email: ({ className }: { className?: string }) => (
    <Mail className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  lock: ({ className }: { className?: string }) => (
    <Lock className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  phone: ({ className }: { className?: string }) => (
    <Phone className={cn("h-4 w-4 text-gray-400", className)} />
  ),
  mapPin: ({ className }: { className?: string }) => (
    <MapPin className={cn("h-4 w-4 text-gray-400", className)} />
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
    state: "", // New state field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  
  // Handle state selection change
  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
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

      // Store user data including state in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          state: formData.state, // Add state to document
          createdAt: new Date().toISOString(),
        });

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
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

        {/* State/Governorate selection field */}
        <div className="grid gap-2 mt-4">
          <Label htmlFor="state">State/Governorate</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <Icons.mapPin />
            </div>
            <Select
              value={formData.state}
              onValueChange={handleStateChange}
              disabled={isLoading}
            >
              <SelectTrigger id="state" className="pl-10 w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {tunisianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="mt-3 text-xs text-gray-500 text-center">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
            . We&apos;ll occasionally send you account-related emails.
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
        <Button variant="outline" type="button" disabled={isLoading}>
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
