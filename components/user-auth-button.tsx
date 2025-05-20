"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LogIn, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        
        // Get display name from user or Firestore
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserName(userData.displayName || userData.firstName || "User");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
        
        // Set avatar URL if available
        setAvatarUrl(user.photoURL);
      } else {
        setUser(null);
        setUserName(null);
        setAvatarUrl(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5 animate-pulse" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={handleLogin}>
        <LogIn className="h-4 w-4 mr-2" />
        Log In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 rounded-full flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>
              {userName ? userName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{userName || "User"}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}