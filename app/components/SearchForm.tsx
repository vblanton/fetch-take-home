"use client";

import { useState, useEffect } from "react";
import { searchDogs, getBreeds } from '../services/dogs';
import { Spinner } from './Spinner';
interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  sort?: string;
}

export default function SearchForm() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [newZipCode, setNewZipCode] = useState<string>("");
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();
  const [sort, setSort] = useState<string>("breed:asc");
  const [isLoading, setIsLoading] = useState(false);
  const [isBreedsLoading, setIsBreedsLoading] = useState(true);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setIsBreedsLoading(true);
        const breeds = await getBreeds();
        setAvailableBreeds(breeds);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      } finally {
        setIsBreedsLoading(false);
      }
    };
    fetchBreeds();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Dispatch tryAgain event to clear matched dog view
      window.dispatchEvent(new Event('tryAgain'));

      const params: SearchParams = {};
      
      if (breeds.length > 0) params.breeds = breeds;
      if (zipCodes.length > 0) params.zipCodes = zipCodes;
      if (ageMin !== undefined) params.ageMin = ageMin;
      if (ageMax !== undefined) params.ageMax = ageMax;
      if (sort) params.sort = sort;

      const { dogs, total } = await searchDogs({
        ...params,
        size: 12,
        from: 0
      });

      // Dispatch a custom event with the search results
      const event = new CustomEvent('dogSearch', {
        detail: { dogs, total }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBreed = e.target.value;
    if (newBreed && !breeds.includes(newBreed)) {
      setBreeds([...breeds, newBreed]);
    }
    setSelectedBreed("");
  };

  const removeBreed = (breedToRemove: string) => {
    setBreeds(breeds.filter(breed => breed !== breedToRemove));
  };

  const handleZipCodeAddClick = () => {
    const zip = newZipCode.trim();
    if (zip && !zipCodes.includes(zip)) {
      setZipCodes([...zipCodes, zip]);
      setNewZipCode("");
    }
  };

  const removeZipCode = (zipToRemove: string) => {
    setZipCodes(zipCodes.filter(zip => zip !== zipToRemove));
  };

  const handleReset = () => {
    setBreeds([]);
    setZipCodes([]);
    setNewZipCode("");
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSort("breed:asc");
  };

  return (
    <form name="search" onSubmit={handleSearch} className="space-y-4 text-black w-full">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[calc(50%-8px)] md:min-w-0">
          <label className="block mb-2 text-sm">Breeds</label>
          <select
            value={selectedBreed}
            onChange={handleBreedChange}
            disabled={isBreedsLoading}
            className={`border border-gray-400 p-2 rounded w-full focus:border-purple-900 focus:outline-none ${
              isBreedsLoading ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">{isBreedsLoading ? 'Loading breeds...' : 'Select a breed to add'}</option>
            {availableBreeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[calc(50%-8px)] md:min-w-0">
          <label className="block mb-2 text-sm">Zip Codes</label>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={newZipCode}
              onChange={(e) => setNewZipCode(e.target.value)}
              placeholder="Enter zip code"
              className="border border-gray-400 p-2 rounded w-full focus:border-purple-900 focus:outline-none"
              pattern="[0-9]{5}"
              title="Please enter a valid 5-digit zip code"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleZipCodeAddClick();
                }
              }}
            />
            <button
              type="button"
              onClick={handleZipCodeAddClick}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 whitespace-nowrap shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-[calc(50%-8px)] md:min-w-0">
          <label className="block mb-2 text-sm">Age Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={ageMin || ''}
              onChange={(e) => setAgeMin(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Min"
              className="border border-gray-400 p-2 rounded w-1/2 focus:border-purple-900 focus:outline-none"
            />
            <input
              type="number"
              value={ageMax || ''}
              onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Max"
              className="border border-gray-400 p-2 rounded w-1/2 focus:border-purple-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[calc(50%-8px)] md:min-w-0">
          <label className="block mb-2 text-sm">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full focus:border-purple-900 focus:outline-none"
          >
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="age:asc">Age (Low to High)</option>
            <option value="age:desc">Age (High to Low)</option>
          </select>
        </div>

        <div className="flex gap-2 w-full">
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 disabled:opacity-50 h-11"
            disabled={isLoading || isBreedsLoading}
          >
            Search {isLoading && <Spinner />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 h-11"
            disabled={isLoading || isBreedsLoading}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Active Filters Section */}
      {(breeds.length > 0 || zipCodes.length > 0 || ageMin !== undefined || ageMax !== undefined) && (
        <div className="flex flex-wrap gap-2">
          {breeds.map((breed) => (
            <div
              key={`breed-${breed}`}
              className="flex items-center gap-1 bg-purple-100 text-purple-900 px-2 py-1 rounded"
            >
              <span>Breed: {breed}</span>
              <button
                type="button"
                onClick={() => removeBreed(breed)}
                className="text-purple-900 hover:text-purple-700"
              >
                ×
              </button>
            </div>
          ))}
          {zipCodes.map((zip) => (
            <div
              key={`zip-${zip}`}
              className="flex items-center gap-1 bg-blue-100 text-blue-900 px-2 py-1 rounded"
            >
              <span>ZIP: {zip}</span>
              <button
                type="button"
                onClick={() => removeZipCode(zip)}
                className="text-blue-900 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
          {(ageMin !== undefined || ageMax !== undefined) && (
            <div className="flex items-center gap-1 bg-green-100 text-green-900 px-2 py-1 rounded">
              <span>
                Age: {ageMin !== undefined ? ageMin : '0'} - {ageMax !== undefined ? ageMax : '∞'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAgeMin(undefined);
                  setAgeMax(undefined);
                }}
                className="text-green-900 hover:text-green-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
} 