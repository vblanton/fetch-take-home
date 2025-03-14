'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { matchDogs } from '../services/dogs';
import { Spinner } from './Spinner';

export default function FavoritesBar() {
  const { favorites, clearFavorites } = useFavorites();
  const { isLoggedIn } = useAuth();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMatch = () => setIsHidden(true);
    const handleTryAgain = () => {
      setIsHidden(false);
      setError(null);
    };

    window.addEventListener('dogMatch', handleMatch);
    window.addEventListener('tryAgain', handleTryAgain);

    return () => {
      window.removeEventListener('dogMatch', handleMatch);
      window.removeEventListener('tryAgain', handleTryAgain);
    };
  }, []);

  const handleClearClick = () => {
    if (showClearConfirm) {
      clearFavorites();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleMatchClick = async () => {
    if (favorites.length < 2) {
      setError('Please select at least 2 dogs to find a match');
      return;
    }

    try {
      setIsMatching(true);
      setError(null);
      const match = await matchDogs(favorites.map(dog => dog.id));
      const matchedDog = favorites.find(dog => dog.id === match);
      if (matchedDog) {
        window.dispatchEvent(new CustomEvent('dogMatch', { detail: matchedDog }));
      }
    } catch (err) {
      console.error('Error matching dogs:', err);
      setError('Failed to find a match. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  if (!isLoggedIn || isHidden) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-2 sm:p-4" role="region" aria-label="Favorites bar">
      <div className="bg-purple-900 text-white rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="font-semibold text-sm sm:text-base">{favorites.length}</span>
          <span className="hidden sm:inline">{favorites.length === 1 ? 'Dog' : 'Dogs'} Favorited</span>
        </div>

        <div className="h-4 sm:h-6 w-px bg-purple-700 mx-1 sm:mx-2" aria-hidden="true"></div>

        <button
          onClick={handleClearClick}
          disabled={isMatching}
          className={`px-2 sm:px-4 py-1 rounded-full text-sm sm:text-base transition-colors cursor-pointer ${
            showClearConfirm 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-purple-700 hover:bg-purple-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={showClearConfirm ? 'Click to confirm clearing all favorites' : 'Clear all favorites'}
          aria-disabled={isMatching}
        >
          {showClearConfirm ? 'Click to Confirm' : 'Clear All'}
        </button>

        <button
          onClick={handleMatchClick}
          disabled={isMatching || favorites.length < 2}
          className="px-2 sm:px-4 py-1 rounded-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
          aria-label="Find a match from favorites"
          aria-disabled={isMatching || favorites.length < 2}
        >
          {isMatching ? (
            <>
              <Spinner />
              <span className="hidden sm:inline">Finding Match...</span>
            </>
          ) : (
            'Find Match'
          )}
        </button>

        {error && (
          <div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 