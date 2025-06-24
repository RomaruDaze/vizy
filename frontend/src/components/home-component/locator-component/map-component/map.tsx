import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.styles.css";
import immigrationOfficesData from "./immigration-offices.json";
import photoBoothData from "./photo-booth.json";

// Fix default marker icon issue with Leaflet + Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom red icon for user location
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to calculate distance between two points using Haversine formula
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

interface MapProps {
  locationType: string;
}

const Map = ({ locationType }: MapProps) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserPosition([userLat, userLon]);

          // Choose data based on location type
          const dataSource =
            locationType === "immigration"
              ? immigrationOfficesData
              : photoBoothData;

          // Filter locations within 100km
          const nearby = dataSource.filter((location) => {
            const distance = calculateDistance(
              userLat,
              userLon,
              location.lat,
              location.lon
            );
            return distance <= 20;
          });

          // Sort by distance (closest first)
          nearby.sort((a, b) => {
            const distanceA = calculateDistance(userLat, userLon, a.lat, a.lon);
            const distanceB = calculateDistance(userLat, userLon, b.lat, b.lon);
            return distanceA - distanceB;
          });

          setNearbyLocations(nearby);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Tokyo
          setUserPosition([35.630184, 139.744451]);
          const dataSource =
            locationType === "immigration"
              ? immigrationOfficesData
              : photoBoothData;
          setNearbyLocations(dataSource);
          setIsLoading(false);
        }
      );
    } else {
      // Fallback if geolocation is not supported
      setUserPosition([35.630184, 139.744451]);
      const dataSource =
        locationType === "immigration"
          ? immigrationOfficesData
          : photoBoothData;
      setNearbyLocations(dataSource);
      setIsLoading(false);
    }
  }, [locationType]);

  // Don't render map until we have the user position
  if (isLoading) {
    return (
      <div className="map-wrapper map-loading">
        <div>Getting your location...</div>
      </div>
    );
  }

  const locationTypeName =
    locationType === "immigration" ? "offices" : "photo machines";

  return (
    <div className="map-wrapper">
      <MapContainer
        center={userPosition!}
        zoom={10}
        className="map-container"  
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* Show nearby locations */}
        {nearbyLocations.map((location, index) => {
          const distance = userPosition
            ? calculateDistance(
                userPosition[0],
                userPosition[1],
                location.lat,
                location.lon
              )
            : 0;

          return (
            <Marker key={index} position={[location.lat, location.lon]}>
              <Popup closeButton={false}>
                <div>
                  <strong>{location.name}</strong>
                  {userPosition && <p>Distance: {distance.toFixed(1)} km</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show user location with red marker */}
        {userPosition && (
          <Marker position={userPosition} icon={redIcon}>
            <Popup closeButton={false}>
              <div>
                <strong>Your Location</strong>
                <p>
                  Found {nearbyLocations.length} {locationTypeName} within 20km
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
