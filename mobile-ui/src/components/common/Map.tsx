// Map.tsx
// Renders a MapLibre map with optional property markers and land use view.
// Supports custom markers, popups, and auto-fit for multiple properties.
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapComponent.css';
import type { PropertyLocation } from '../../types';

// Props for MapLibreMap component
interface LeafletMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  landUse?: boolean;
  properties?: PropertyLocation[];
}

/**
 * MapLibreMap component
 * Renders a MapLibre map centered at given lat/lng, with optional property markers and land use tiles.
 * - If properties are provided, shows custom markers and fits bounds.
 * - If no properties, shows a default marker at center.
 */
const LeafletMap: React.FC<LeafletMapProps> = ({
  lat = 12.9716,
  lng = 77.5946,
  zoom = 15,
  className = '',
  landUse = false,
  properties = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cleanup previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Cleanup previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Pick style URL based on landUse prop
    const styleUrl = landUse
      ? 'https://api.maptiler.com/maps/streets-v2/style.json?key=YguiTF06mLtcpSVKIQyc'
      : 'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc';

    // Create MapLibre map instance
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      pitch: 0, // Initial tilt angle (0-85 degrees)
      bearing: 0, // Initial rotation
      dragRotate: true, // Enable rotation with right-click/ctrl+drag
      pitchWithRotate: true, // Enable pitch when rotating
      touchPitch: true, // Enable pitch on touch devices
    });

    // Add navigation controls (includes pitch/tilt buttons)
    mapRef.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true, // Shows pitch/tilt indicator
      }),
      'top-right'
    );

    // Prevent context menu on map to enable right-click drag
    mapContainerRef.current.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Create custom marker element
    const createMarkerElement = (status: string) => {
      const color =
        status === 'HIGH'
          ? 'rgba(163, 2, 2, 0.8)'
          : status === 'MEDIUM'
          ? 'rgba(165, 148, 0, 1)'
          : 'rgba(0, 112, 60, 0.8)';

      const el = document.createElement('div');
      el.style.cssText = `
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      return el;
    };

    // Wait for map to load before adding markers
    mapRef.current.on('load', () => {
      // Add markers for properties (if provided)
      if (properties && properties.length > 0) {
        const bounds = new maplibregl.LngLatBounds();

        properties.forEach((property) => {
          const markerEl = createMarkerElement(property.status);

          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #333;">${property.applicationNo}</h4>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Status: ${property.status}</p>
              <p style="margin: 0; font-size: 11px; color: #888;">${property.address}</p>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: markerEl })
            .setLngLat([property.lng, property.lat])
            .setPopup(popup)
            .addTo(mapRef.current!);

          markersRef.current.push(marker);
          bounds.extend([property.lng, property.lat]);
        });

        // Fit bounds to show all properties
        mapRef.current!.fitBounds(bounds, { padding: 50 });
      } else {
        // Add default marker at center
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          landUse ? 'Land Use View' : 'You are here!'
        );

        const marker = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
        popup.addTo(mapRef.current!);
      }
    });

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, zoom, landUse, properties]);

  return (
    <div
      ref={mapContainerRef}
      className={`leaflet-map ${className}`}
      style={{
        height: 400,
        width: 338,
        borderLeft: '1px solid #000',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        borderTop: 'none',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        overflow: 'hidden',
      }}
    />
  );
};

export default LeafletMap;
