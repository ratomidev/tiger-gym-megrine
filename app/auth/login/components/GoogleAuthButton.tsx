// GoogleAuthButton.tsx
"use client";

import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Icons } from "@/components/icons";

interface GoogleAuthButtonProps {
  onSuccess?: (user: User) => void;
  onError?: (message: string) => void;
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const createOrUpdateUserInFirestore = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      await updateDoc(userRef, { lastLogin: serverTimestamp() });
    } else {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createOrUpdateUserInFirestore(user);

      onSuccess?.(user);
    } catch {
      onError?.("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loading}
      variant="outline"
      className="w-full justify-center"
    >
      {loading ? ( <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />) 
      : ( <Icons.google className="mr-2 h-4 w-4" /> )}
      Continue with Google
    </Button>
  );
}
