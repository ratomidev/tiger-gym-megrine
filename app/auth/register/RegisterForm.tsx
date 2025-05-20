"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

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

      console.log("User:", user);

      toast.success("Account created successfully!");
      
      // Redirect after successful registration
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

    } catch (error: any) {
      let errorMessage = "Error creating user";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already registered";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    
    try {
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      
      // Store user data in Firestore
      await storeUserData(user);
      
      toast.success("Successfully signed up with Google!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      let errorMessage = "Failed to sign up with Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed before completing";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked by your browser";
      }
      
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Add this function to store user data
  const storeUserData = async (user: User) => {
    if (!user) return;
    
    try {
      // Create a reference to the user document
      const userRef = doc(db, "users", user.uid);
      
      // Check if the document already exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || '',
          providerId: 'google.com',
          lastLogin: serverTimestamp(),
          createdAt: serverTimestamp()
        });
      } else {
        // Update the last login time if the user already exists
        await setDoc(userRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error storing user data:", error);
      toast.error("Failed to save your profile information");
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
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Processing...
              </>
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