import { ref, get } from "firebase/database";
import { database } from "../firebase/config";

export interface Location {
  name: string;
  lat: number;
  lon: number;
  address?: string;
}

export interface PhotoBoothLocation extends Location {
  address: string;
}

export interface ImmigrationOffice extends Location {
  // Add any specific fields for immigration offices
}

// Function to get all immigration offices
export const getImmigrationOffices = async (): Promise<ImmigrationOffice[]> => {
  try {
    const immigrationRef = ref(database, "immigration-offices");
    const snapshot = await get(immigrationRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array if needed
      return Array.isArray(data) ? data : Object.values(data);
    }

    return [];
  } catch (error) {
    console.error("Error fetching immigration offices:", error);
    return [];
  }
};

// Function to get all photo booths
export const getPhotoBooths = async (): Promise<PhotoBoothLocation[]> => {
  try {
    const photoBoothRef = ref(database, "photo-booths");
    const snapshot = await get(photoBoothRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array if needed
      return Array.isArray(data) ? data : Object.values(data);
    }

    return [];
  } catch (error) {
    console.error("Error fetching photo booths:", error);
    return [];
  }
};

// Function to get locations within a certain distance (optional optimization)
export const getLocationsInRange = async (
  locationType: "immigration-offices" | "photo-booths",
  centerLat: number,
  centerLon: number,
  maxDistance: number = 20
): Promise<Location[]> => {
  try {
    const locationRef = ref(database, locationType);
    const snapshot = await get(locationRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const locations = Array.isArray(data) ? data : Object.values(data);

      // Filter locations within the specified distance
      return locations.filter((location: Location) => {
        const distance = calculateDistance(
          centerLat,
          centerLon,
          location.lat,
          location.lon
        );
        return distance <= maxDistance;
      });
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${locationType}:`, error);
    return [];
  }
};

// Helper function to calculate distance (same as in your map component)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Add this new function
export const getLocationsNearby = async (
  locationType: "immigration-offices" | "photo-booths",
  userLat: number,
  userLon: number,
  maxDistance: number = 20
): Promise<Location[]> => {
  try {
    const locationRef = ref(database, locationType);
    const snapshot = await get(locationRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const locations = Array.isArray(data) ? data : Object.values(data);

      // Filter and sort by distance
      const nearby = locations
        .filter((location: Location) => {
          const distance = calculateDistance(
            userLat,
            userLon,
            location.lat,
            location.lon
          );
          return distance <= maxDistance;
        })
        .sort((a: Location, b: Location) => {
          const distanceA = calculateDistance(userLat, userLon, a.lat, a.lon);
          const distanceB = calculateDistance(userLat, userLon, b.lat, b.lon);
          return distanceA - distanceB;
        })
        .slice(0, 20); // Limit to 20 closest locations

      return nearby;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching nearby ${locationType}:`, error);
    return [];
  }
};
