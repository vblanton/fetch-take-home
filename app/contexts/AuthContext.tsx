"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for localStorage
const AUTH_STORAGE_KEY = 'auth_state';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const { isLoggedIn: storedIsLoggedIn, timestamp } = JSON.parse(storedAuth);
        // Only restore if the stored state is less than 24 hours old
        if (storedIsLoggedIn && timestamp && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setIsLoggedIn(true);
        } else {
          // Clear expired auth state
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing auth state:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        isLoggedIn,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 