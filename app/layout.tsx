import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import FavoritesBar from "./components/FavoritesBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adopt a Dog",
  description: "Find your perfect furry friend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FavoritesProvider>
            {children}
            <FavoritesBar />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
