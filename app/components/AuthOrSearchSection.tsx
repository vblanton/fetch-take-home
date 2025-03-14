"use client";

import AuthForm from "./AuthForm";
import SearchForm from "./SearchForm";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

export default function AuthOrSearchSection() {
  const { isLoggedIn, isLoading } = useAuth();
  const [isDarkened, setIsDarkened] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleHighlight = () => {
      setIsDarkened(true);
      setTimeout(() => setIsDarkened(false), 500);
    };

    const handleMatch = () => setIsHidden(true);
    const handleTryAgain = () => setIsHidden(false);

    window.addEventListener('highlight-auth-inputs', handleHighlight);
    window.addEventListener('dogMatch', handleMatch);
    window.addEventListener('tryAgain', handleTryAgain);

    return () => {
      window.removeEventListener('highlight-auth-inputs', handleHighlight);
      window.removeEventListener('dogMatch', handleMatch);
      window.removeEventListener('tryAgain', handleTryAgain);
    };
  }, []);

  if (isLoading) {
    return (
      <div 
        id="auth-or-search-section" 
        className="shadow-md h-fit mx-4 rounded-lg dark:bg-gray-100 bg-white mt-[-4rem] p-4 relative z-10 flex flex-col items-center justify-center transition-all duration-500">
        <div className="w-full animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isHidden) return null;

  return (
    <div 
      id="auth-or-search-section" 
      className={`shadow-md h-fit mx-2 md:mx-4 rounded-lg mt-[-4rem] p-4 relative z-10 flex flex-col items-center justify-center transition-all duration-500 ${
        isDarkened ? 'bg-purple-400' : 'dark:bg-gray-100 bg-white'
      }`}>
        {isLoggedIn ? (
          <SearchForm />
        ) : (
          <AuthForm />
        )}
    </div>
  );
} 