"use client";

import Image from "next/image";
import { useState } from "react";
import { logout } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./Spinner";
import Link from "next/link";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        logout(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    window.dispatchEvent(new Event('highlight-auth-inputs'));
  };

  return (
    <header className="">
      <div className="max-w-screen-xl mx-auto overflow-hidden max-h-[250px]">
        <nav className="flex items-center justify-between gap-2 py-2 px-2 md:px-4"> 
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo3.svg" 
                className="bg-white rounded-full" 
                alt="adoptadog logo" 
                width={52} 
                height={52}
                priority
                quality={100}
              />
              <span className="text-white text-xl sm:text-2xl font-semibold">AdoptADog</span>
            </Link>
            <div className="grow"></div>
            {isAuthLoading ? (
              <div className="h-11 w-24 bg-purple-700 rounded-lg animate-pulse"></div>
            ) : isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center h-11 justify-center gap-2 text-white hover:text-gray-200 disabled:opacity-50 px-4 py-2 bg-purple-900 rounded hover:bg-purple-800 transition-colors cursor-pointer"
              >
                Logout {isLoading && <Spinner />}
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="text-white h-11 hover:text-gray-200 px-4 py-2 bg-purple-900 rounded hover:bg-purple-800 transition-colors cursor-pointer"
              >
                Login
              </button>
            )}
        </nav>
        <div className="flex md:flex-row flex-col px-2 md:px-12 md:justify-around md:items-center">
          <div className="hidden md:block text-2xl lg:text-3xl text-white text-center w-full md:mb-12 md:w-1/2 md:max-w-[350px]">
            Adopt, Love, Cherish ❤️
            <span className="text-base block">The Joy of Pet Adoption</span>
          </div>
          <div className="md:w-1/2">
            <Image 
                src="/banner2.png" 
                alt="group of dogs" 
                width={1524} 
                height={730} 
                className="h-full"
                quality={85}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1524px"
              />
          </div>
        </div>
      </div>
    </header>
  );
} 