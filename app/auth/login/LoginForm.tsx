"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Phone auth states
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  // const [verificationId, setVerificationId] = React.useState("");
  const [showPhoneInput, setShowPhoneInput] = React.useState(false);
  const [showVerificationInput, setShowVerificationInput] =
    React.useState(false);
  const [confirmationResult, setConfirmationResult] = React.useState<any>(null);

  // Initialize reCAPTCHA once when component mounts
  React.useEffect(() => {
    // Cleanup any existing reCAPTCHA to avoid duplicates
    const recaptchaWrappers = document.querySelectorAll(
      ".firebase-recaptcha-container"
    );
    recaptchaWrappers.forEach((wrapper) => {
      wrapper.innerHTML = "";
    });
  }, []);

  // Email/password login handler
  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Firebase email/password authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem("user", JSON.stringify(user));

      // Delay redirect to give toast time to display
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error: any) {
      // Error handling code (unchanged)
      let message = "Login failed. Please try again.";

      if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password";
      } else if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed login attempts. Please try again later.";
      } else if (error.code === "auth/user-disabled") {
        message = "This account has been disabled. Please contact support.";
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope("profile");
      googleProvider.addScope("email");

      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store basic auth user info
      localStorage.setItem("user", JSON.stringify(user));

      // Check if user document exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User already exists, just update last login
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        });

        toast.success(`Welcome back, ${user.displayName || "User"}!`, {
          duration: 2000,
        });
      } else {
        // New user, create document in Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          phoneNumber: user.phoneNumber || "",
          providerId: "google.com",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        toast.success(`Welcome to RYX, ${user.displayName || "User"}!`, {
          duration: 2000,
        });
      }

      // Delay redirect to give toast time to display
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      let message = "Failed to sign in with Google";

      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign-in popup was closed before completing";
      } else if (error.code === "auth/popup-blocked") {
        message = "Sign-in popup was blocked by your browser";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        message =
          "An account already exists with the same email but different sign-in credentials";
      }

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Phone auth - Step 1: Send verification code
  const handlePhoneAuth = async () => {
    if (!showPhoneInput) {
      setShowPhoneInput(true);
      return;
    }

    if (phoneNumber.trim() === "") {
      setErrorMessage("Please enter a phone number");
      return;
    }

    setIsPhoneLoading(true);
    setErrorMessage(null);

    try {
      // Initialize reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            // reCAPTCHA solved, allow sending verification code
          },
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please verify again.");
          },
        }
      );

      // Format phone number (ensure it has country code)
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // Send verification code
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setShowVerificationInput(true);
      toast.success("Verification code sent to your phone!");
    } catch (error: any) {
      console.error("Phone auth error:", error);

      let message = "Failed to send verification code";
      if (error.code === "auth/invalid-phone-number") {
        message =
          "Invalid phone number format. Please include country code (+1 for US)";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later";
      } else if (error.code === "auth/captcha-check-failed") {
        message = "reCAPTCHA verification failed. Please try again";
      }

      setErrorMessage(message);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  // Phone auth - Step 2: Verify code and sign in
  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      setErrorMessage("Please request a verification code first");
      return;
    }

    if (verificationCode.trim() === "") {
      setErrorMessage("Please enter the verification code");
      return;
    }

    setIsPhoneLoading(true);
    setErrorMessage(null);

    try {
      // Confirm the verification code
      const userCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;

      // Store user info
      localStorage.setItem("user", JSON.stringify(user));

      // Update last login in Firestore
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
          });
        }
      } catch (firestoreError) {
        console.error("Error updating Firestore:", firestoreError);
        // Continue with auth flow even if Firestore update fails
      }

      toast.success("Phone verification successful!");

      // Reset phone auth states
      setShowPhoneInput(false);
      setShowVerificationInput(false);
      setPhoneNumber("");
      setVerificationCode("");
      setConfirmationResult(null);

      // Navigate to home
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error: any) {
      console.error("Code verification error:", error);

      let message = "Invalid verification code";
      if (error.code === "auth/invalid-verification-code") {
        message = "The verification code is invalid. Please try again";
      } else if (error.code === "auth/code-expired") {
        message = "The verification code has expired. Please request a new one";
      }

      setErrorMessage(message);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  // Handle canceling phone auth
  const handleCancelPhoneAuth = () => {
    setShowPhoneInput(false);
    setShowVerificationInput(false);
    setPhoneNumber("");
    setVerificationCode("");
    setConfirmationResult(null);
    setErrorMessage(null);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Regular login form (unchanged) */}
      {!showPhoneInput && (
        <form onSubmit={onSubmit}>
          <div className="grid gap-3">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
            <Button className="mt-2" disabled={isLoading} type="submit">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Log In
            </Button>
          </div>
        </form>
      )}

      {/* Phone number input */}
      {showPhoneInput && !showVerificationInput && (
        <div className="grid gap-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number (with country code)</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isPhoneLoading}
              required
            />
            <p className="text-xs text-gray-500">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* reCAPTCHA container */}
          <div
            id="recaptcha-container"
            className="firebase-recaptcha-container"
          ></div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={isPhoneLoading || phoneNumber.trim() === ""}
              onClick={handlePhoneAuth}
              type="button"
            >
              {isPhoneLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Code
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelPhoneAuth}
              disabled={isPhoneLoading}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Verification code input */}
      {showPhoneInput && showVerificationInput && (
        <div className="grid gap-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="123456"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isPhoneLoading}
              required
            />
            <p className="text-xs text-gray-500">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={isPhoneLoading || verificationCode.trim() === ""}
              onClick={handleVerifyCode}
              type="button"
            >
              {isPhoneLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Code
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelPhoneAuth}
              disabled={isPhoneLoading}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Divider and alternative login methods */}
      {!showPhoneInput && (
        <>
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

          <Button
            variant="outline"
            type="button"
            disabled={isLoading || isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            {isGoogleLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading || isPhoneLoading}
            onClick={() => handlePhoneAuth()}
          >
            {isPhoneLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.phone className="mr-2 h-4 w-4" />
            )}
            Phone
          </Button>
        </>
      )}
    </div>
  );
}
