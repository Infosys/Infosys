// This file defines the SearchPropertyMap component, which displays a Leaflet map preview
// with a marker at a fixed location. The map can be toggled between interactive and static modes.

import { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { 
  mapComponentOuterStyle, 
  mapWrapperContainerStyle, 
  mapDivStyle, 
  mapOverlayStyle 
} from '../../styles/SearchPropertyMap/SearchPropertyMapStyle';
import propertyMarkerIcon from '../../assets/Proptery one.svg';

const customIcon = L.icon({
  iconUrl: propertyMarkerIcon,
  iconSize: [40, 40], // Adjust size as needed
  iconAnchor: [20, 40], // Adjust anchor so the tip points to the location
  popupAnchor: [0, -40],
});

// Configure default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// MapWrapper renders the actual Leaflet map and manages its interactivity
function MapWrapper({ interactive }: { interactive: boolean }) {
  const mapRef = useRef<HTMLDivElement | null>(null); // Ref to the map container div
  const mapInstance = useRef<L.Map | null>(null); // Ref to the Leaflet map instance

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clean up existing map instance if present
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    
    // Clear the map container
    mapRef.current.innerHTML = '';
    
    const center: [number, number] = [12.9141, 77.6387]; // Default center (Bangalore)
    
    // Create the Leaflet map
    const map = L.map(mapRef.current, { 
      zoomControl: false,
      attributionControl: false,
      preferCanvas: false,
      renderer: L.svg()
    }).setView(center, 15);
    
    mapInstance.current = map;
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
      detectRetina: true
    }).addTo(map);
    
    // Add a marker at the center
    L.marker(center, { icon: customIcon }).addTo(map);L.marker(center, { icon: customIcon }).addTo(map).bindPopup('Gandhi Nagar Complex');
        
    // Enable or disable map interactions based on the prop
    if (!interactive) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
      if ((map as any).tap) (map as any).tap.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();
      if ((map as any).tap) (map as any).tap.enable();
    }
    
    // Force map to resize and re-render after mount/layout changes
    const resizeMap = () => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize(true);
      }
    };
    setTimeout(resizeMap, 50);
    setTimeout(resizeMap, 200);
    setTimeout(resizeMap, 500);
    
    // Cleanup on unmount
    return () => { 
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [interactive]);

  return (
    <Box
      ref={mapRef}
      sx={mapDivStyle}
    />
  );
}

// Main component for displaying the map with an overlay to toggle interactivity
const SearchPropertyMap = () => {
  const [interactive, setInteractive] = useState(false); // State to control map interactivity

  return (
    <Box sx={mapComponentOuterStyle}>
      <Box sx={mapWrapperContainerStyle}>
        <MapWrapper interactive={interactive} />
        {/* Overlay to activate map interactivity on click */}
        {!interactive && (
          <Box
            sx={mapOverlayStyle}
            onClick={() => setInteractive(true)}
            title="Click to activate map"
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchPropertyMap;