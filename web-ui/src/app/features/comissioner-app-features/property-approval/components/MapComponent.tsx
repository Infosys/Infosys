
// React hooks for state, refs, and side effects
import { useRef, useEffect, useState } from 'react';
// Leaflet library for interactive maps
import L from "leaflet";
// MUI Box component for layout and styling
import { Box } from "@mui/material";
// Import style objects for the map component
import {
  mapComponentOuterStyle,
  mapWrapperContainerStyle,
  mapDivStyle,
  mapOverlayStyle,
} from "../styles/MapComponent";


/**
 * MapWrapper renders a Leaflet map inside a Box component.
 * It can be interactive or static based on the 'interactive' prop.
 */
export function MapWrapper({ interactive }: { interactive: boolean }) {
  // Reference to the map container div
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // Set the initial center of the map (latitude, longitude)
    const center: [number, number] = [12.9141, 77.6387];
    // Initialize the Leaflet map
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(center, 15);
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    // Add a marker at the center with a popup
    L.marker(center).addTo(map).bindPopup('Gandhi Nagar Complex');
    // If not interactive, disable all user interactions
    if (!interactive) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
    }
    // Ensure map resizes after render for proper tile loading
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    // Cleanup: remove the map instance on unmount
    return () => { map.remove(); };
  }, [interactive]);

  return (
    <Box
      ref={mapRef}
      sx={mapDivStyle}
    />
  );
}


/**
 * MapComponent displays a static map preview by default.
 * When the overlay is clicked, the map becomes interactive (user can pan/zoom).
 */
export default function MapComponent() {
  // State to control whether the map is interactive
  const [interactive, setInteractive] = useState(false);

  return (
    <Box sx={mapComponentOuterStyle}>
      <Box sx={mapWrapperContainerStyle}>
        {/* Render the map, passing the interactive state */}
        <MapWrapper interactive={interactive} />
        {/* Overlay disables interaction until clicked */}
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
}