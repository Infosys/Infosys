import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, CircularProgress, type SxProps } from '@mui/material';
import type { Theme } from '@emotion/react';

/**
 * Props interface for MapLibreMap component
 */
interface MapLibreMapProps {
  readonly latitude: number;
  readonly longitude: number;
  readonly width?: string;
  readonly height?: string;
  readonly borderRadius?: string;
  readonly zoom?: number;
  readonly style?: SxProps<Theme>;
}

/**
 * Constants for map configuration
 */
const MAP_CONFIG = {
  TILE_URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_SIZE: 256,
  ATTRIBUTION: '© OpenStreetMap contributors',
  MIN_ZOOM: 0,
  MAX_ZOOM: 24,
  MARKER_COLOR: '#000000',
  MARKER_SCALE: 0.65,
  INTERSECTION_THRESHOLD: 0.1,
} as const;

/**
 * Default props values
 */
const DEFAULT_PROPS = {
  WIDTH: '96px',
  HEIGHT: '74px',
  BORDER_RADIUS: '8px',
  ZOOM: 24,
} as const;

/**
 * Creates the MapLibre style configuration
 */
const createMapStyle = () => ({
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [MAP_CONFIG.TILE_URL],
      tileSize: MAP_CONFIG.TILE_SIZE,
      attribution: MAP_CONFIG.ATTRIBUTION,
    },
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: MAP_CONFIG.MIN_ZOOM,
      maxzoom: MAP_CONFIG.MAX_ZOOM,
    },
  ],
});

/**
 * MapLibreMap Component
 *
 * Displays a static map with a marker using MapLibre GL
 * Features lazy loading with Intersection Observer for performance
 */
export const MapLibreMap: React.FC<MapLibreMapProps> = ({
  latitude,
  longitude,
  width = DEFAULT_PROPS.WIDTH,
  height = DEFAULT_PROPS.HEIGHT,
  borderRadius = DEFAULT_PROPS.BORDER_RADIUS,
  zoom = DEFAULT_PROPS.ZOOM,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  /**
   * Cleanup map marker with error handling
   */
  const cleanupMarker = useCallback(() => {
    if (!markerRef.current) return;

    try {
      markerRef.current.remove();
      markerRef.current = null;
    } catch (error) {
      console.warn('[MapLibreMap] Failed to remove marker:', error);
    }
  }, []);

  /**
   * Cleanup map instance with error handling
   */
  const cleanupMap = useCallback(() => {
    if (!mapInstanceRef.current) return;

    try {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    } catch (error) {
      console.warn('[MapLibreMap] Failed to remove map:', error);
    }
  }, []);

  /**
   * Create and add marker to map with error handling
   */
  const addMarkerToMap = useCallback(
    (map: maplibregl.Map, lng: number, lat: number) => {
      try {
        const marker = new maplibregl.Marker({
          color: MAP_CONFIG.MARKER_COLOR,
          scale: MAP_CONFIG.MARKER_SCALE,
        })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;
        setIsLoaded(true);
      } catch (error) {
        console.error('[MapLibreMap] Failed to add marker:', error);
        setIsLoaded(true); // Still show the map even if marker fails
      }
    },
    []
  );

  /**
   * Initialize map instance with error handling
   */
  const initializeMap = useCallback(
    (container: HTMLDivElement) => {
      try {
        const mapInstance = new maplibregl.Map({
          container: container,
          center: [longitude, latitude],
          zoom: zoom,
          interactive: false,
          attributionControl: false,
          style: createMapStyle() as any,
        });

        mapInstanceRef.current = mapInstance;

        mapInstance.on('load', () => {
          addMarkerToMap(mapInstance, longitude, latitude);
        });

        mapInstance.on('error', (error) => {
          console.error('[MapLibreMap] Map error:', error);
          setIsLoaded(true); // Show error state instead of infinite loading
        });
      } catch (error) {
        console.error('[MapLibreMap] Failed to initialize map:', error);
        setIsLoaded(true);
      }
    },
    [latitude, longitude, zoom, addMarkerToMap]
  );

  /**
   * Update marker position with error handling
   */
  const updateMarkerPosition = useCallback(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;

    if (!map || !marker) return;

    try {
      map.setCenter([longitude, latitude]);
      marker.setLngLat([longitude, latitude]);
    } catch (error) {
      console.warn('[MapLibreMap] Failed to update marker position:', error);
    }
  }, [latitude, longitude]);

  /**
   * Setup Intersection Observer to detect when map enters viewport
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: MAP_CONFIG.INTERSECTION_THRESHOLD }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Initialize the map when it comes into view
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isInView || mapInstanceRef.current) {
      return;
    }

    initializeMap(container);

    return () => {
      cleanupMarker();
      cleanupMap();
    };
  }, [isInView, initializeMap, cleanupMarker, cleanupMap]);

  /**
   * Update marker position when coordinates change
   */
  useEffect(() => {
    updateMarkerPosition();
  }, [updateMarkerPosition]);

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