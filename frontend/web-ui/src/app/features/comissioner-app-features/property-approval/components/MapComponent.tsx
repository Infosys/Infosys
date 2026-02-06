// React hooks for state, refs, and side effects
import { useRef, useEffect, useState } from 'react';
// MapLibre GL library for interactive maps
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
 * MapWrapper renders a MapLibre GL map inside a Box component.
 * It can be interactive or static based on the 'interactive' prop.
 */
export function MapWrapper({
  interactive,
  center = [77.6387, 12.9141]
}: {
  interactive: boolean;
  center?: [number, number];
}) {
  // DOM and MapLibre instance references
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    // Initialize the MapLibre GL map
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=YguiTF06mLtcpSVKIQyc',
      center: center,
      zoom: 15,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add zoom control at bottom-left
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), 
      'bottom-left'
    );

    // Add a marker at the center with a popup
    const marker = new maplibregl.Marker()
      .setLngLat(center)
      .setPopup(new maplibregl.Popup().setHTML('<div>Gandhi Nagar Complex</div>'))
      .addTo(map);

    // If not interactive, disable all user interactions
    if (!interactive) {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoomRotate.disable();
    }

    // Ensure map resizes after render for proper tile loading
    setTimeout(() => {
      map.resize();
    }, 200);

    // Cleanup: remove the map instance on unmount
    return () => {
      marker.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [interactive, center]);

  return (
    <Box
      ref={mapRef}
      sx={mapDivStyle}
    />
  );
}


interface MapComponentProps {
  coordinates?: { latitude?: number; longitude?: number; Latitude?: number; Longitude?: number } | null;
  interactive?: boolean;
}

/**
 * MapComponent displays a static map preview by default.
 * When the overlay is clicked, the map becomes interactive (user can pan/zoom).
 */
export default function MapComponent({
  coordinates = null,
  interactive: initialInteractive = false
}: MapComponentProps = {}) {
  // State to control whether the map is interactive
  const [interactive, setInteractive] = useState(initialInteractive);

  // Extract coordinates with fallback to defaults
  const center: [number, number] = coordinates
    ? [
      coordinates.longitude ?? coordinates.Longitude ?? 77.6387,
      coordinates.latitude ?? coordinates.Latitude ?? 12.9141
    ]
    : [77.6387, 12.9141];

  return (
    <Box sx={mapComponentOuterStyle}>
      <Box sx={mapWrapperContainerStyle}>
        {/* Render the map, passing the interactive state */}
        <MapWrapper interactive={interactive} center={center} />
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
