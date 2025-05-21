"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

interface PhoneAuthFormProps {
  onSuccess: (user: User) => void;
  onError?: (message: string) => void;
  onCancel: () => void;
}

export function PhoneAuthForm({ onSuccess, onError, onCancel }: PhoneAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [showVerificationInput, setShowVerificationInput] = React.useState(false);
  const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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

  // Phone auth - Send verification code
  const handleSendCode = async () => {
    if (phoneNumber.trim() === "") {
      setErrorMessage("Please enter a phone number");
      if (onError) onError("Please enter a phone number");
      return;
    }

    setIsLoading(true);
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
    } catch (error: unknown) {
      console.error("Phone auth error:", error);

      let message = "Failed to send verification code";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-phone-number") {
          message =
            "Invalid phone number format. Please include country code (+1 for US)";
        } else if (error.code === "auth/too-many-requests") {
          message = "Too many requests. Please try again later";
        } else if (error.code === "auth/captcha-check-failed") {
          message = "reCAPTCHA verification failed. Please try again";
        } else if (error.code === "auth/billing-not-enabled") {
          message = "Phone authentication is not enabled for this project. Please contact the administrator.";
        }
      }

      setErrorMessage(message);
      if (onError) onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Phone auth - Verify code and sign in
  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      const message = "Please request a verification code first";
      setErrorMessage(message);
      if (onError) onError(message);
      return;
    }

    if (verificationCode.trim() === "") {
      const message = "Please enter the verification code";
      setErrorMessage(message);
      if (onError) onError(message);
      return;
    }

    setIsLoading(true);
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

      // Call success callback
      onSuccess(user);
    } catch (error: unknown) {
      console.error("Code verification error:", error);

      let message = "Invalid verification code";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-verification-code") {
          message = "The verification code is invalid. Please try again";
        } else if (error.code === "auth/code-expired") {
          message = "The verification code has expired. Please request a new one";
        }
      }

      setErrorMessage(message);
      if (onError) onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Rendering the verification code form
  if (showVerificationInput) {
    return (
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
            disabled={isLoading}
            required
          />
          <p className="text-xs text-gray-500">
            Enter the 6-digit code sent to {phoneNumber}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={isLoading || verificationCode.trim() === ""}
            onClick={handleVerifyCode}
            type="button"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Code
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Rendering the phone number input form
  return (
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
          placeholder="+216 XX XXX XXX"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
          required
        />
        <p className="text-xs text-gray-500">
          Include country code (e.g., +216 for TN)
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
          disabled={isLoading || phoneNumber.trim() === ""}
          onClick={handleSendCode}
          type="button"
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Send Code
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}