import { Dog, Location } from '@/app/types/types';

// Common fetch options for all API calls
const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export interface DogsResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: { lat: number; lon: number };
    top_right?: { lat: number; lon: number };
  };
  size?: number;
  from?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Calculate distance between two points using the Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const searchNearbyLocations = async (
  latitude: number,
  longitude: number,
  radiusDegrees: number = 1
): Promise<Location[]> => {
  try {
    const searchParams: LocationSearchParams = {
      size: 100,
      geoBoundingBox: {
        top: latitude + radiusDegrees,
        bottom: latitude - radiusDegrees,
        left: longitude - radiusDegrees,
        right: longitude + radiusDegrees
      }
    };

    const response = await fetch('/api/locations?action=search', {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      throw new Error('Failed to search locations');
    }

    const data = await response.json();
    
    // The API returns an array directly, not wrapped in a results object
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return [];
    }
    
    // Sort locations by distance from user
    return data.sort((a: { latitude: number; longitude: number; }, b: { latitude: number; longitude: number; }) => {
      const distA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distA - distB;
    });
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const searchDogs = async (
  searchParams: {
    size?: number;
    from?: number;
    sort?: string;
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    userLocation?: Coordinates;
  } = { size: 12, from: 0, sort: 'breed:asc' }
): Promise<{ dogs: Dog[]; total: number; next: string | null; prev: string | null }> => {
  try {
    // Build query string from search params
    const queryParams = new URLSearchParams();
    if (searchParams.size) queryParams.append('size', searchParams.size.toString());
    if (searchParams.from) queryParams.append('from', searchParams.from.toString());
    if (searchParams.sort) queryParams.append('sort', searchParams.sort);
    if (searchParams.breeds?.length) searchParams.breeds.forEach(breed => queryParams.append('breeds', breed));
    if (searchParams.zipCodes?.length) searchParams.zipCodes.forEach(zip => queryParams.append('zipCodes', zip));
    if (searchParams.ageMin) queryParams.append('ageMin', searchParams.ageMin.toString());
    if (searchParams.ageMax) queryParams.append('ageMax', searchParams.ageMax.toString());
    queryParams.append('action', 'search');

    // First, get the IDs of matching dogs
    const searchResponse = await fetch(`/api/dogs?${queryParams.toString()}`, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!searchResponse.ok) {
      throw new Error('Failed to search dogs');
    }

    const { resultIds, total, next, prev }: DogsResponse = await searchResponse.json();

    if (resultIds.length === 0) {
      return { dogs: [], total: 0, next: null, prev: null };
    }

    // Then, get the actual dog data for these IDs
    const dogsResponse = await fetch('/api/dogs?action=fetch', {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(resultIds),
    });

    if (!dogsResponse.ok) {
      throw new Error('Failed to fetch dog details');
    }

    let dogs: Dog[] = await dogsResponse.json();

    // If user location is provided and we're not using a specific sort order,
    // sort dogs by distance from user
    if (searchParams.userLocation && !searchParams.sort) {
      // Get locations for all unique ZIP codes
      const uniqueZipCodes = Array.from(new Set(dogs.map(dog => dog.zip_code)));
      const locations = await getLocations(uniqueZipCodes);
      
      // Create a map of ZIP codes to locations for quick lookup
      const zipToLocation = new Map(
        locations.map(loc => [loc.zip_code, loc])
      );

      // Sort dogs by distance from user
      dogs = dogs.sort((a, b) => {
        const locA = zipToLocation.get(a.zip_code);
        const locB = zipToLocation.get(b.zip_code);
        
        if (!locA || !locB) return 0;
        
        const distA = calculateDistance(
          searchParams.userLocation!.latitude,
          searchParams.userLocation!.longitude,
          locA.latitude,
          locA.longitude
        );
        const distB = calculateDistance(
          searchParams.userLocation!.latitude,
          searchParams.userLocation!.longitude,
          locB.latitude,
          locB.longitude
        );
        
        return distA - distB;
      });
    }

    return { dogs, total, next, prev };
  } catch (error) {
    console.error('Error fetching dogs:', error);
    throw error;
  }
};

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  try {
    const response = await fetch('/api/locations', {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(zipCodes),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export async function matchDogs(dogIds: string[]): Promise<string> {
  const response = await fetch('/api/dogs?action=match', {
    method: 'POST',
    ...fetchOptions,
    body: JSON.stringify(dogIds)
  });

  if (!response.ok) {
    throw new Error('Failed to get match');
  }

  const data = await response.json();
  return data.match;
}

export async function getBreeds(): Promise<string[]> {
  try {
    const response = await fetch('/api/dogs?action=breeds', {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
} 