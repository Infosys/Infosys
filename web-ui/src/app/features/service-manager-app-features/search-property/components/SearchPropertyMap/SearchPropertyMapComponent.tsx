import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, CircularProgress, type SxProps } from '@mui/material';
import type { Theme } from '@emotion/react';

interface MapLibreMapProps {
  latitude: number;
  longitude: number;
  width?: string;
  height?: string;
  borderRadius?: string;
  zoom?: number;
  style?: SxProps<Theme>;
}

export const MapLibreMap: React.FC<MapLibreMapProps> = ({
  latitude,
  longitude,
  width = '96px',
  height = '74px',
  borderRadius = '8px',
  zoom = 24,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null); // Added marker ref
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer to detect when the map is in the viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize the map when it is in view
  useEffect(() => {
    if (!containerRef.current || !isInView || mapInstanceRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: containerRef.current!,
      center: [longitude, latitude],
      zoom: zoom,
      interactive: false,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 24,
          },
        ],
      },
    });

    mapInstanceRef.current = mapInstance;

    mapInstance.on('load', () => {
      // Add marker when map loads
      const marker = new maplibregl.Marker({
        color: '#000000', // Black marker (you can customize the color)
        scale: 0.65,
      })
        .setLngLat([longitude, latitude])
        .addTo(mapInstance);

      markerRef.current = marker;
      setIsLoaded(true);
    });

    return () => {
      // Clean up marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      // Clean up map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isInView, latitude, longitude, zoom]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter([longitude, latitude]);
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude]);

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        borderRadius,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  );
};