'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Dog } from '@/app/types/types';

interface FavoritesContextType {
  favorites: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId: string) => void;
  clearFavorites: () => void;
  isFavorite: (dogId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Dog[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dogFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dogFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (dog: Dog) => {
    setFavorites(prev => [...prev, dog]);
  };

  const removeFavorite = (dogId: string) => {
    setFavorites(prev => prev.filter(dog => dog.id !== dogId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (dogId: string) => {
    return favorites.some(dog => dog.id === dogId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 