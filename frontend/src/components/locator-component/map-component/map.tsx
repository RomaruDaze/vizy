import { useEffect, useState, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.styles.css";
import {
  getImmigrationOffices,
  getPhotoBooths,
  getLocationsNearby,
} from "../../../services/locationService";
import type { Location } from "../../../services/locationService";

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

// Component to handle map controls and track view changes
const MapControls = ({
  userPosition,
  onViewChange,
  mapRef,
}: {
  userPosition: [number, number] | null;
  onViewChange: (isAtUserLocation: boolean) => void;
  mapRef: React.MutableRefObject<{ resetToUserLocation: () => void } | null>;
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

  // Track map view changes
  useEffect(() => {
    const checkViewPosition = () => {
      if (userPosition) {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();

        // Check if map is centered on user location and at appropriate zoom
        const isAtUserLocation =
          Math.abs(currentCenter.lat - userPosition[0]) < 0.001 &&
          Math.abs(currentCenter.lng - userPosition[1]) < 0.001 &&
          currentZoom >= 12;

        onViewChange(isAtUserLocation);
      }
    };

    // Check position on map events
    map.on("moveend", checkViewPosition);
    map.on("zoomend", checkViewPosition);

    // Initial check
    checkViewPosition();

    return () => {
      map.off("moveend", checkViewPosition);
      map.off("zoomend", checkViewPosition);
    };
  }, [map, userPosition, onViewChange]);

  // Set up the reset function in the ref
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resetToUserLocation = () => {
        if (userPosition) {
          map.setView(userPosition, 13, {
            animate: true,
            duration: 1,
          });
        }
      };
    }
  }, [map, userPosition, mapRef]);

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
  onViewChange?: (isAtUserLocation: boolean) => void;
}

interface MapRef {
  resetToUserLocation: () => void;
}

const Map = forwardRef<MapRef, MapProps>(
  ({ locationType, onViewChange }, ref) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
    const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      null
    );
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
        try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
              async (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserPosition([userLat, userLon]);

                // Use the optimized function
                const nearby = await getLocationsNearby(
            locationType === "immigration"
                    ? "immigration-offices"
                    : "photo-booths",
              userLat,
              userLon,
                  20
                );

          setNearbyLocations(nearby);
          setIsLoading(false);
        },
        (error) => {
                console.error("Geolocation error:", error);
                fetchFallbackData();
              }
            );
          } else {
            fetchFallbackData();
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      };

      const fetchFallbackData = async () => {
        try {
          let dataSource: Location[] = [];
          if (locationType === "immigration") {
            dataSource = await getImmigrationOffices();
    } else {
            dataSource = await getPhotoBooths();
          }
      setNearbyLocations(dataSource);
      setIsLoading(false);
        } catch (error) {
          console.error("Error fetching fallback data:", error);
          setIsLoading(false);
    }
      };

      fetchData();
  }, [locationType]);

    const handleLocationClick = (location: Location) => {
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

    const handleViewChange = (isAtUserLocation: boolean) => {
      if (onViewChange) {
        onViewChange(isAtUserLocation);
      }
    };

    // Forward the ref
    useEffect(() => {
      if (ref && typeof ref === "object") {
        ref.current = {
          resetToUserLocation: () => {
            // This will be set by MapControls
          },
        };
      }
    }, [ref]);

  // Don't render map until we have the user position
  if (isLoading) {
    return (
      <div className="map-wrapper map-loading">
          <div className="loading-spinner"></div>
          <div>Loading nearby locations...</div>
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

          {/* Map Controls with view tracking */}
          <MapControls
            userPosition={userPosition}
            onViewChange={handleViewChange}
            mapRef={
              ref as React.MutableRefObject<{
                resetToUserLocation: () => void;
              } | null>
            }
          />

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
                    Found {nearbyLocations.length} {locationTypeName} within
                    20km
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
  }
);

Map.displayName = "Map";

export default Map;
