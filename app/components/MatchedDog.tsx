import { useState } from "react";
import { Dog } from "../types/types";
import Image from "next/image";
import Confetti from "./Confetti";
import { useAuth } from "../contexts/AuthContext";

interface MatchedDogProps {
  dog: Dog & { distance?: number };
  onTryAgain: () => void;
}

export default function MatchedDog({ dog, onTryAgain }: MatchedDogProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleTryAgain = () => {
    // Dispatch tryAgain event to show FavoritesBar
    window.dispatchEvent(new Event('tryAgain'));
    onTryAgain();
  };

  const handleAdopt = () => {
    setShowConfetti(true);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <div className="w-full mx-auto mt-[-64px]">
        <div className="bg-white mx-2 rounded-lg shadow-lg overflow-hidden">
          <div className="transition-all duration-500 relative h-96 md:h-128 w-full overflow-hidden">
            <div className="absolute inset-0 blur-[4px] m-[-4px]">
              <Image
                src={dog.img}
                alt={`${dog.breed} dog`}
                fill
                className="object-cover"
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                loading="lazy"
              />
            </div>
            <div className="relative h-full w-full">
              <Image
                src={dog.img}
                alt={`${dog.breed} dog`}
                fill
                className="object-contain"
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                loading="lazy"
              />
            </div>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{dog.name}</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">Breed:</span> {dog.breed}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Age:</span> {dog.age} years
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span> {dog.zip_code}
                {typeof dog.distance === 'number' && ` (${dog.distance.toFixed()} miles away)`}
              </p>
            </div>
            <div className="flex gap-4 mt-6 min-h-11">
              <button
                onClick={handleTryAgain}
                className="flex-1 bg-purple-900 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors"
              >
                Try Another Search
              </button>
              <button
                onClick={handleAdopt}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Adopt {dog.name}!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 