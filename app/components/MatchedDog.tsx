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
        <div className="bg-white mx-2 rounded-lg pt-2 shadow-lg overflow-hidden">
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
            <div className="flex flex-wrap gap-4">
              <div className="text-gray-600 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 64 64"
                >
                  <g transform="translate(1, 6)">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      d="M34.7,42c-2.8,0-6.4,4.9-6.4,8h-5.2c-1.7,0-3.2,1.6-3.2,3.5c0,2,1.4,3.4,3.2,3.4h22.5C58.6,57,62.1,45.3,61,37.1c0,0-11.1,11.8-14.1,11.8c0.1-12.2-8.9-23.7-14.8-29C28.8,16.9,27.9,9,27.9,9V4.8c0-4.3-0.3-8.9-1.2-9.5c-1.6-1.1-4.4,4.6-6.7,4.6c-11.7,0-10,8-12.5,8H2.2C0,7.9,0,9.7,0,10.9c0.2,3.3,1.9,6,10,6c2,0,5.1,2.8,5.1,7.9v26.1H15c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h15.75"
                    />
                    <path
                      fill="currentColor"
                      d="M20.9,38v8.8"
                    />
                    <path
                      fill="currentColor"
                      d="M1,14h6"
                    />
                  </g>
                </svg>
                <span aria-label={`Breed: ${dog.breed}`}>{dog.breed}</span>
              </div>
              <div className="text-gray-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m7.994.013-.595.79a.747.747 0 0 0 .101 1.01V4H5a2 2 0 0 0-2 2v3H2a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-1V6a2 2 0 0 0-2-2H8.5V1.806A.747.747 0 0 0 8.592.802zM4 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v.414a.9.9 0 0 1-.646-.268 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0A.9.9 0 0 1 4 6.414zm0 1.414c.49 0 .98-.187 1.354-.56a.914.914 0 0 1 1.292 0c.748.747 1.96.747 2.708 0a.914.914 0 0 1 1.292 0c.374.373.864.56 1.354.56V9H4zM1 11a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.793l-.354.354a.914.914 0 0 1-1.293 0 1.914 1.914 0 0 0-2.707 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0L1 11.793zm11.646 1.854a1.915 1.915 0 0 0 2.354.279V15H1v-1.867c.737.452 1.715.36 2.354-.28a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.708 0a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.707 0a.914.914 0 0 1 1.293 0Z"/>
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
                <span aria-label={`Location: ${dog.zip_code}${typeof dog.distance === 'number' ? ` (${dog.distance.toFixed()} miles away)` : ''}`}>
                  {dog.zip_code} {typeof dog.distance === 'number' && `(${dog.distance.toFixed()} miles away)`}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-6 min-h-11">
              <button
                onClick={handleTryAgain}
                className="flex-1 bg-purple-900 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors cursor-pointer"
              >
                Try Another Search
              </button>
              <button
                onClick={handleAdopt}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
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