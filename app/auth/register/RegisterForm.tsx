"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirebaseError } from "firebase/app";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const tunisianStates = [
  "Ariana",
  "Beja",
  "Ben Arous",
  "Bizerte",
  "Gabes",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kebili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Medenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan"
];

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    state: "",
  });

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log("User:", user);

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create a new user document in Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: `${formData.firstname} ${formData.lastname}`,
          phone: formData.phone,
          state: formData.state,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Account created successfully!");
      
      // Redirect after successful registration
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Error signing in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  const handleStateChange = (value: string) => {
    setFormData(prev => ({ ...prev, state: value }));
  };
  
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

      console.log("User:", user);

      toast.success("Account created successfully!");
      
      // Redirect after successful registration
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

    } catch (error: unknown) {
      let errorMessage = "Error creating user";
      
      // Type check for FirebaseError before accessing the code property
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "Email is already registered";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address";
        }
      }
      
      toast.error(errorMessage);
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
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleSignUp}
        >
          {isGoogleLoading ? (
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