"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/auth";
import { SessionCheck } from "@/components/auth/SessionCheck";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load - fetch user from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
  };

  // Logout function - calls API
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {/* Session check component to handle expired sessions */}
      {user && <SessionCheck />}
      {children}
    </AuthContext.Provider>
  );
}