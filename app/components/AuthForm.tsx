"use client";

import { useState } from "react";
import { login } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./Spinner";

export default function AuthForm() {
  const { setIsLoggedIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const startTime = Date.now();
      await login({ name, email });
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 750) {
        await new Promise(resolve => setTimeout(resolve, 750 - elapsedTime));
      }
      setIsLoggedIn(true);
      setName("");
      setEmail("");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form name="login" onSubmit={handleLogin} className="w-full max-w-md">
      <div className="flex flex-col space-y-4 items-center">
        <div className="flex flex-col w-full gap-4 text-black">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? "name-error" : undefined}
            />
            {error && <div id="name-error" className="text-red-500 text-sm mt-1" role="alert">{error}</div>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && <div id="email-error" className="text-red-500 text-sm mt-1" role="alert">{error}</div>}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 flex items-center justify-center gap-2 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded w-full max-w-[200px] disabled:opacity-50 cursor-pointer"
          aria-busy={isLoading}
        >
            Login {isLoading && <Spinner />}
        </button>
      </div>
    </form>
  );
} 