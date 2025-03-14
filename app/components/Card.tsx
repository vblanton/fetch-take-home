'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Dog } from '@/app/types/types';
import { useFavorites } from '@/app/contexts/FavoritesContext';

interface CardProps {
  dog: Dog;
  distance?: number;
  isLoading?: boolean;
}

const CardSkeleton = () => (
  <div className="card bg-white rounded-lg shadow-md relative animate-pulse">
    <div className="relative aspect-[4/3] bg-gray-200 rounded-t-lg" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  </div>
);

const Card: React.FC<CardProps> = ({ dog, distance, isLoading = false }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const toggleFavorite = async () => {
    if (isFavoriteLoading) return;
    
    setIsFavoriteLoading(true);
    const isCurrentlyLiked = isFavorite(dog.id);
    
    try {
      if (!isCurrentlyLiked) {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 700);
        await addFavorite(dog);
      } else {
        await removeFavorite(dog.id);
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const isLiked = isFavorite(dog.id);

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div 
      className="card bg-white rounded-lg shadow-md relative group"
      onDoubleClick={handleDoubleClick}
    >
      <button
        onClick={handleLikeClick}
        disabled={isFavoriteLoading}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/35 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 ${
          isFavoriteLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={isLiked ? "red" : "none"}
          stroke={isLiked ? "red" : "black"}
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`transition-colors ${isFavoriteLoading ? 'animate-pulse' : ''}`}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      
      {showAnimation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="red"
            viewBox="0 0 24 24"
            className="animate-scale-fade"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <div className="relative w-[110%] h-[110%] -ml-[5%] -mt-[5%] group-hover:scale-105 transition-transform duration-300">
          <Image
            src={dog.img}
            alt={`${dog.name}, a ${dog.breed} dog`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-center ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={false}
            loading="lazy"
            quality={75}
            onLoadingComplete={() => setIsImageLoading(false)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjU1PVBVXWRkXWyEhIf/2wBDARUXFx4aHjshITtBNkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{dog.name}</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="text-gray-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m7.994.013-.595.79a.747.747 0 0 0 .101 1.01V4H5a2 2 0 0 0-2 2v3H2a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-1V6a2 2 0 0 0-2-2H8.5V1.806A.747.747 0 0 0 8.592.802zM4 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v.414a.9.9 0 0 1-.646-.268 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0A.9.9 0 0 1 4 6.414zm0 1.414c.49 0 .98-.187 1.354-.56a.914.914 0 0 1 1.292 0c.748.747 1.96.747 2.708 0a.914.914 0 0 1 1.292 0c.374.373.864.56 1.354.56V9H4zM1 11a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.793l-.354.354a.914.914 0 0 1-1.293 0 1.914 1.914 0 0 0-2.707 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0L1 11.793zm11.646 1.854a1.915 1.915 0 0 0 2.354.279V15H1v-1.867c.737.452 1.715.36 2.354-.28a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.708 0a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.707 0a.914.914 0 0 1 1.293 0Z"/>
            </svg>
            <span aria-label={`Breed: ${dog.breed}`}>{dog.breed}</span>
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            <span aria-label={`Age: ${dog.age} ${dog.age === 1 ? 'year' : 'years'}`}>
              {dog.age} {dog.age === 1 ? 'year' : 'years'}
            </span>
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            <span aria-label={`Location: ${dog.zip_code}${typeof distance === 'number' ? ` (${distance.toFixed()} miles away)` : ''}`}>
              {dog.zip_code} {typeof distance === 'number' && `(${distance.toFixed()} miles away)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card; 