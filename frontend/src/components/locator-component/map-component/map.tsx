import  { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Component to handle map controls
const MapControls = ({
  userPosition,
}: {
  userPosition: [number, number] | null;
}) => {
  const map = useMap();

  const handleMyLocationClick = () => {
    if (userPosition) {
      map.setView(userPosition, 13, {
        animate: true,
        duration: 1,
      });
    }
  };

  return (
    <div className="map-controls">
      <button
        className="my-location-btn"
        onClick={handleMyLocationClick}
        title="Go to my location"
      >
        <img
          src="https://img.icons8.com/ios-filled/100/define-location--v1.png"
          alt="My Location"
        />
      </button>
    </div>
  );
};

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
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

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

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    setShowDetailPopup(true);
  };

  const handlePhoneClick = () => {
    // For now, just show an alert. You can replace this with actual phone functionality
    alert("Phone functionality will be implemented here");
  };

  const handleDirectionClick = () => {
    if (selectedLocation) {
      // Open Google Maps with directions from user's current location
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userPosition?.[0]},${userPosition?.[1]}&destination=${selectedLocation.lat},${selectedLocation.lon}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedLocation(null);
  };

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
        zoom={13}
        className="map-container"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* Map Controls */}
        <MapControls userPosition={userPosition} />

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
                <div
                  className="location-popup clickable"
                  onClick={() => handleLocationClick(location)}
                >
                  <strong>{location.name}</strong>
                  {userPosition && <p>Distance: {distance.toFixed(1)} km</p>}
                  <p className="click-for-more">Click for more details</p>
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

      {/* Detailed popup overlay */}
      {showDetailPopup && selectedLocation && (
        <div className="detail-popup-overlay">
          <div className="detail-popup">
            <button className="close-button" onClick={handleCloseDetailPopup}>
              ×
            </button>
            <div className="detail-content">
              <h3>{selectedLocation.name}</h3>
              {userPosition && (
                <p className="distance">
                  Distance:{" "}
                  {calculateDistance(
                    userPosition[0],
                    userPosition[1],
                    selectedLocation.lat,
                    selectedLocation.lon
                  ).toFixed(1)}{" "}
                  km
                </p>
              )}
              <div className="action-buttons">
                <button
                  className="action-btn phone-btn"
                  onClick={handlePhoneClick}
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png"
                    alt="Phone"
                  />
                  <span>Call</span>
                </button>
                <button
                  className="action-btn direction-btn"
                  onClick={handleDirectionClick}
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/FFFFFF/compass.png"
                    alt="Directions"
                  />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
