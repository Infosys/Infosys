// This file defines the PropertyMapPreview component, which displays a static map preview
// with a marker at the given property location using react-leaflet and OpenStreetMap tiles.

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import pointer from '../../assets/Proptery one.svg';
import { v4 as uuidv4 } from 'uuid';

// Props for the PropertyMapPreview component
interface PropertyMapPreviewProps {
  location: {
    lat: number; // Latitude of the property
    lng: number; // Longitude of the property
  };
  style?: React.CSSProperties; // Optional custom styles for the map container
  mapkey?: string; // Optional unique key for the map instance
}

// Custom marker icon for the property location
const markerIcon = new L.Icon({
  iconUrl: pointer,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Functional component for displaying a static map preview with a marker
const PropertyMapPreview: React.FC<PropertyMapPreviewProps> = ({ location, style }) => {
  return(
    <MapContainer
      key={`${uuidv4()}`} // Generate unique key for each map instance
      center={[location.lat, location.lng]} // Center the map at the property location
      zoom={15} // Set zoom level for close-up view
      style={style || { width: '96px', height: '100%', borderRadius: '8px' }} // Apply custom or default styles
      zoomControl={false} // Disable zoom controls
      dragging={false} // Disable dragging
      scrollWheelZoom={false} // Disable scroll wheel zoom
      doubleClickZoom={false} // Disable double click zoom
      attributionControl={false} // Hide attribution
      touchZoom={false} // Disable touch zoom
      boxZoom={false} // Disable box zoom
      keyboard={false} // Disable keyboard controls
    >
      {/* OpenStreetMap tile layer for map background */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Marker at the property location */}
      <Marker position={[location.lat, location.lng]} icon={markerIcon} />
    </MapContainer>
  );
};

export default PropertyMapPreview;