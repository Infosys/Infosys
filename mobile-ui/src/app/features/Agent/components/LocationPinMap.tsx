
// LocationPinMap component displays a Leaflet map with a fixed center pin and reverse geocoding
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers not appearing in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// Props for LocationPinMap
interface LocationPinMapProps {
  center: [number, number]; // Initial center of the map
  onLocationUpdate: (lat: number, lng: number, address: string) => void; // Callback when location changes
}

// Helper function to get reverse geocoded address with fallback
// Tries Photon API, then a simple area lookup, then falls back to coordinates
const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    // Use Photon API which is CORS-friendly
    const response = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.properties) {
          const props = feature.properties;
          const parts = [];
          
          // Build address from available components
          if (props.housenumber) parts.push(props.housenumber);
          if (props.street) parts.push(props.street);
          if (props.district) parts.push(props.district);
          if (props.city) parts.push(props.city);
          if (props.state) parts.push(props.state);
          
          if (parts.length > 0) {
            return parts.join(', ');
          }
          
          // Fallback to name if available
          if (props.name) {
            return props.name;
          }
        }
      }
    }
  } catch (error) {
    console.warn('Photon geocoding failed, trying alternative:', error);
  }
  
  // Try alternative approach with a simple area lookup
  try {
    // For Indian coordinates, provide a basic area estimation
    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
      // This is within India bounds
      const areas = {
        bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
        delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
        mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
        chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
        hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
        pune: { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' }
      };
      
      // Find closest major city
      let closestArea = 'Unknown Area, India';
      let minDistance = Infinity;
      
      Object.values(areas).forEach(area => {
        const distance = Math.sqrt(
          Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestArea = area.name;
        }
      });
      
      return `Near ${closestArea}`;
    }
  } catch (error) {
    console.warn('Area lookup failed:', error);
  }
  
  // Final fallback: return formatted coordinates
  return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
};


const LocationPinMap: React.FC<LocationPinMapProps> = ({ center, onLocationUpdate }) => {
  // Reference to the Leaflet map instance
  const mapRef = useRef<L.Map | null>(null);
  // Reference for debouncing location updates
  const debounceTimeoutRef = useRef<number | null>(null);
  // Reference to the map container div
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ResizeObserver to handle map resizing when container size changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Aggressively fix map size after mount
  useEffect(() => {
    const fixMapSize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
        mapRef.current.getContainer().style.height = '100%';
      }
    };

    const intervals = [100, 250, 500, 1000];
    const timeouts = intervals.map(delay => setTimeout(fixMapSize, delay));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Clean up debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handler for when the map stops moving (user pans/zooms)
  const handleMapMoveEnd = () => {
    if (!mapRef.current) return;

    // Get the center coordinates for location display (no pin needed)
    const mapCenter = mapRef.current.getCenter();
    const lat = mapCenter.lat;
    const lng = mapCenter.lng;

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the location update
    debounceTimeoutRef.current = window.setTimeout(async () => {
      if (!mapRef.current) return;

      try {
        // Use a more reliable geocoding approach
        const address = await getReverseGeocodedAddress(lat, lng);
        onLocationUpdate(lat, lng, address);
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationUpdate(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    }, 500); // 500ms debounce
  };

  // Handler for when the map is ready (mounted)
  const handleMapReady = () => {
    // Simplified map size fixing with new CSS overrides
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    }, 100);
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    }, 500);
  };

  return (
    <div 
      ref={containerRef}
      className="location-map-container"
    >
      {/* Leaflet MapContainer with no visible marker, just a center pin overlay */}
      <MapContainer
        center={center}
        zoom={16}
        //dragging={false}
        className="location-leaflet-map"
        ref={(mapInstance) => {
          if (mapInstance) {
            mapRef.current = mapInstance;
            mapInstance.on('moveend', handleMapMoveEnd);
            handleMapReady();
          }
        }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
      
      {/* Center Pin Overlay with Popup - Figma Design */}
      <div className="center-pin">
        <div className="pin-icon"></div>
        <div className="pin-popup">
          <span>Move the map to position the pin</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPinMap;