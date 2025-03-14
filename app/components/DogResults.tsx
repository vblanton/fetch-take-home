"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import { searchDogs, searchNearbyLocations, Coordinates, calculateDistance, getLocations } from "../services/dogs";
import { Dog, Location } from "../types/types";
import { useAuth } from "../contexts/AuthContext";
import MatchedDog from "./MatchedDog";

interface DogWithDistance extends Dog {
  distance?: number;
}

export default function DogResults() {
  const { isLoggedIn } = useAuth();
  const [dogs, setDogs] = useState<DogWithDistance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDogs, setTotalDogs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  
  const dogsPerPage = 12;

  useEffect(() => {
    // Get user's location and find nearby locations
    if (isLoggedIn && !nearbyLocations.length && !locationError) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setUserLocation(coords);
            
            const locations = await searchNearbyLocations(
              coords.latitude,
              coords.longitude,
              0.5 // ~35 mile radius
            );
            setNearbyLocations(locations);
          } catch (err) {
            console.error('Error fetching nearby locations:', err);
            setLocationError('Failed to find nearby locations. Showing all available dogs instead.');
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError('Location access denied. Showing all available dogs instead.');
        }
      );
    }
  }, [isLoggedIn, nearbyLocations.length, locationError]);

  const loadDogs = async (page: number) => {
    if (!isLoggedIn) {
      setDogs([]);
      setTotalDogs(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const from = (page - 1) * dogsPerPage;
      
      // If we have nearby locations, use them to filter dogs
      const searchParams = {
        size: dogsPerPage,
        from,
        ...(!userLocation ? { sort: 'breed:asc' } : {}),
        ...(nearbyLocations.length > 0 && {
          zipCodes: nearbyLocations.map(loc => loc.zip_code)
        }),
        ...(userLocation && { userLocation })
      };

      const { dogs: newDogs, total } = await searchDogs(searchParams);

      // If we have user location, calculate distances
      if (userLocation) {
        try {
          // Get locations for all unique ZIP codes
          const uniqueZipCodes = Array.from(new Set(newDogs.map(dog => dog.zip_code)));
          const locations = await getLocations(uniqueZipCodes);
          
          // Create a map of ZIP codes to locations for quick lookup
          const zipToLocation = new Map(
            locations.map((loc: Location) => [loc.zip_code, loc])
          );

          // Add distances to dogs
          const dogsWithDistances = newDogs.map(dog => {
            const location = zipToLocation.get(dog.zip_code);
            if (location) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                location.latitude,
                location.longitude
              );
              return { ...dog, distance };
            }
            return dog;
          });

          setDogs(dogsWithDistances);
        } catch (err) {
          console.error('Error calculating distances:', err);
          // Fallback to showing dogs without distances
          setDogs(newDogs);
        }
      } else {
        setDogs(newDogs);
      }
      
      setTotalDogs(total);
    } catch (err) {
      setError("Failed to load dogs. Please try again later.");
      console.error("Error loading dogs:", err);
      setDogs([]);
      setTotalDogs(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDogs(currentPage);
  }, [currentPage, isLoggedIn, nearbyLocations, userLocation]);

  useEffect(() => {
    if (shouldScroll) {
      document.getElementById('auth-or-search-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  const handlePageChange = (newPage: number) => {
    // Scroll first
    document.getElementById('auth-or-search-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });

    // Update page after a small delay to allow smooth scroll to complete
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 600);
  };

  const totalPages = Math.ceil(totalDogs / dogsPerPage);

  const handleTryAgain = () => {
    setMatchedDog(null);
  };

  // Listen for match from FavoritesBar
  useEffect(() => {
    const handleMatch = (event: CustomEvent<Dog>) => {
      setMatchedDog(event.detail);
    };

    window.addEventListener('dogMatch', handleMatch as EventListener);
    return () => {
      window.removeEventListener('dogMatch', handleMatch as EventListener);
    };
  }, []);

  // Listen for tryAgain event
  useEffect(() => {
    const handleTryAgainEvent = () => {
      setMatchedDog(null);
    };

    window.addEventListener('tryAgain', handleTryAgainEvent);
    return () => {
      window.removeEventListener('tryAgain', handleTryAgainEvent);
    };
  }, []);

  // Add event listener for search results
  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ dogs: DogWithDistance[]; total: number }>) => {
      setDogs(event.detail.dogs);
      setTotalDogs(event.detail.total);
      setCurrentPage(1); // Reset to first page when new search is performed
    };

    window.addEventListener('dogSearch', handleSearch as EventListener);
    return () => {
      window.removeEventListener('dogSearch', handleSearch as EventListener);
    };
  }, []);

  if (matchedDog) {
    return <MatchedDog dog={matchedDog} onTryAgain={handleTryAgain} />;
  }

  return (
    <>
      {!isLoggedIn && (
        <div className="text-center text-gray-600 pt-4">
          Please log in to show available dogs.
        </div>
      )}
      {error ? (
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">{error}</div>
          <button 
            onClick={() => loadDogs(currentPage)}
            className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div id="results-container" className="transition-all duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 p-2 md:p-4">
            {isLoading ? (
              // Show skeleton cards during loading
              Array.from({ length: dogsPerPage }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              <>
                {dogs.map((dog) => (
                  <Card 
                    key={dog.id} 
                    dog={dog} 
                    distance={dog.distance}
                  />
                ))}
                {isLoggedIn && dogs.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-600 mb-4">No dogs found. Try changing your search criteria.</div>
                    <button 
                      onClick={() => loadDogs(currentPage)}
                      className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800"
                    >
                      Refresh Results
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-11 px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 h-11 flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-11 px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
} 