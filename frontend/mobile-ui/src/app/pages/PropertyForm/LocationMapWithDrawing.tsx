// LocationMapWithDrawing.tsx
// Interactive map component for property location selection and polygon drawing
// Features:
//   - Uses MapLibre GL for map rendering and drawing
//   - Allows users to draw polygons to mark property boundaries
//   - Supports reverse geocoding to fetch address for selected location
//   - Handles both read-only and interactive modes
//   - Exposes control methods to parent via refs
//   - Responsive UI with custom overlays and popups
// Used in: Property form workflow for selecting and drawing property location

import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../../styles/CustomDrawingToolbar.css';
import locatePropertyIcon from '../../assets/PropertyMarker.svg';

interface LocationMapWithDrawingProps {
  center: [number, number];
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  addressLabel?: string;
  onShapeDrawn?: (shapeData: ShapeData) => void;
  initialShapes?: Array<{
    type: 'polyline' | 'rectangle' | 'polygon' | 'point';
    coordinates: number[] | number[][];
    area?: number;
  }>;
  readOnly?: boolean;
  externalMapRef?: React.RefObject<maplibregl.Map | null>;
  externalFinishRef?: React.RefObject<{
    finish?: () => void;
    start?: () => void;
    clear?: () => void;
  } | null>;
  onClearAll?: () => void;
  startDrawing?: boolean;
  onMapMoveStart?: () => void;
  onLocationLockChange?: (locked: boolean) => void;
  onDrawingPathChange?: (pointCount: number) => void;
}

interface ShapeData {
  type: 'rectangle' | 'polygon';
  coordinates: number[] | number[][];
  area?: number;
  id: string;
  address?: string;
  addedAt?: string;
}

type DrawingTool = 'polygon' | null;

// Helper function to build address from properties
const buildAddressFromProperties = (props: Record<string, string>): string => {
  const parts = [];
  if (props.housenumber) parts.push(props.housenumber);
  if (props.street) parts.push(props.street);
  if (props.district) parts.push(props.district);
  if (props.city) parts.push(props.city);
  if (props.state) parts.push(props.state);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return props.name || '';
};

// Helper function for reverse geocoding
const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const feature = data.features?.[0];
      if (feature?.properties) {
        const address = buildAddressFromProperties(feature.properties);
        if (address) {
          return address;
        }
      }
    }
  } catch (error) {
    console.warn('Geocoding failed:', error);
  }

  return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
};

const LocationMapWithDrawing: React.FC<LocationMapWithDrawingProps> = ({
  center,
  onLocationUpdate,
  onShapeDrawn,
  initialShapes = [],
  readOnly = false,
  addressLabel,
  externalMapRef,
  externalFinishRef,
  onClearAll,
  startDrawing,
  onMapMoveStart,
  onLocationLockChange,
  onDrawingPathChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const activeToolRef = useRef<DrawingTool>(null);
  const programmaticPanRef = useRef<boolean>(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const polygonLayersRef = useRef<string[]>([]);
  const lastCentroidShapeIdRef = useRef<string | null>(null);

  const [activeTool, setActiveTool] = useState<DrawingTool>(null);
  const shapesVisible = true;
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState<ShapeData[]>([]);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [polygonCentroid, setPolygonCentroid] = useState<[number, number] | null>(null);
  const [locationLocked, setLocationLocked] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  /**
   * Clear all drawn shapes and reset selection
   * Removes markers, polygon layers, and resets state
   */
  const clearAllShapes = () => {
    setDrawnShapes([]);
    setCurrentPath([]);
    setPolygonCentroid(null);
    setLocationLocked(false);

    // Remove all markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove all polygon layers
    if (mapRef.current) {
      polygonLayersRef.current.forEach((layerId) => {
        if (mapRef.current!.getLayer(layerId)) {
          mapRef.current!.removeLayer(layerId);
        }
        if (mapRef.current!.getLayer(`${layerId}-outline`)) {
          mapRef.current!.removeLayer(`${layerId}-outline`);
        }
        if (mapRef.current!.getSource(layerId)) {
          mapRef.current!.removeSource(layerId);
        }
      });
      polygonLayersRef.current = [];
      lastCentroidShapeIdRef.current = null;
    }

    // Notify parent if provided
    onLocationLockChange?.(false);
    onClearAll?.();
  };

  /**
   * Calculate polygon area using simple approximation
   * Returns area in square meters
   */
  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;

    let area = 0;
    for (let coordIndex = 0; coordIndex < coordinates.length; coordIndex++) {
      const nextIndex = (coordIndex + 1) % coordinates.length;
      area += coordinates[coordIndex][0] * coordinates[nextIndex][1];
      area -= coordinates[nextIndex][0] * coordinates[coordIndex][1];
    }
    return Math.abs(area / 2) * 111320 * 111320;
  };

  /**
   * Add polygon to map as a fill layer with outline
   */
  const addPolygonToMap = (shape: ShapeData) => {
    if (!mapRef.current || shape.type !== 'polygon') return;

    if (!mapRef.current.isStyleLoaded()) {
      console.warn('Map style not loaded yet, deferring polygon add');
      return;
    }

    const coords = shape.coordinates as number[][];
    const sourceId = shape.id;

    // Convert coordinates and close the polygon
    const coordinates = coords.map(([lng, lat]) => [lng, lat]);
    coordinates.push(coordinates[0]);

    const geojson = {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates],
      },
      properties: {
        id: shape.id,
        address: shape.address,
        area: shape.area,
      },
    };

    // Add source if not exists
    if (!mapRef.current.getSource(sourceId)) {
      mapRef.current.addSource(sourceId, {
        type: 'geojson',
        data: geojson as any,
      });
    }

    // Add fill layer
    const fillLayerId = sourceId;
    if (!mapRef.current.getLayer(fillLayerId)) {
      mapRef.current.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': readOnly ? '#C84C0E' : '#7f1d1d',
          'fill-opacity': readOnly ? 0.2 : 0.3,
        },
      });
      polygonLayersRef.current.push(fillLayerId);
    }

    // Add outline layer
    const outlineLayerId = `${sourceId}-outline`;
    if (!mapRef.current.getLayer(outlineLayerId)) {
      mapRef.current.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': readOnly ? '#C84C0E' : '#7f1d1d',
          'line-width': readOnly ? 3 : 4,
        },
      });
      polygonLayersRef.current.push(outlineLayerId);
    }
  };

  /**
   * Add marker to map with custom icon
   */
  const addMarkerToMap = (lng: number, lat: number, iconUrl: string) => {
    if (!mapRef.current) {
      console.warn('Map ref not available when trying to add marker');
      return null;
    }

    const img = document.createElement('img');
    img.src = iconUrl;
    img.style.width = '36px';
    img.style.height = '36px';
    img.style.cursor = 'pointer';
    img.alt = 'Location marker';

    const element = document.createElement('div');
    element.className = 'custom-marker';
    element.style.width = '36px';
    element.style.height = '36px';
    element.appendChild(img);

    const marker = new maplibregl.Marker({
      element,
      anchor: 'bottom',
      offset: [0, 0],
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markersRef.current.push(marker);
    return marker;
  };

  /**
   * Compute polygon centroid using geographic coordinates
   * Uses the shoelace formula
   */
  const computePolygonCentroid = (coords: [number, number][]) => {
    const points = coords.map(([lat, lng]) => ({ xCoord: lng, yCoord: lat }));
    let twiceArea = 0;
    let xSum = 0;
    let ySum = 0;
    
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
      const nextIndex = (pointIndex + 1) % points.length;
      const crossProduct = points[pointIndex].xCoord * points[nextIndex].yCoord - 
                          points[nextIndex].xCoord * points[pointIndex].yCoord;
      twiceArea += crossProduct;
      xSum += (points[pointIndex].xCoord + points[nextIndex].xCoord) * crossProduct;
      ySum += (points[pointIndex].yCoord + points[nextIndex].yCoord) * crossProduct;
    }
    
    const area = twiceArea / 2;
    
    // Handle degenerate case (zero area)
    if (Math.abs(area) < 1e-9) {
      const average = points.reduce(
        (accumulator, point) => ({ 
          xCoord: accumulator.xCoord + point.xCoord, 
          yCoord: accumulator.yCoord + point.yCoord 
        }),
        { xCoord: 0, yCoord: 0 }
      );
      return { 
        lat: average.yCoord / points.length, 
        lng: average.xCoord / points.length 
      };
    }
    
    const centroidX = xSum / (6 * area);
    const centroidY = ySum / (6 * area);
    return { lat: centroidY, lng: centroidX };
  };

  /**
   * Compute centroid using map projection (pixel coordinates) for better accuracy
   * Falls back to geographic centroid if map is not loaded
   */
  const computePolygonCentroidProjected = (coords: [number, number][]) => {
    try {
      const map = mapRef.current;
      if (!map?.loaded()) {
        return computePolygonCentroid(coords);
      }

      // Project coordinates to pixel space
      const projected = coords.map(([lat, lng]) => {
        const projectedPoint = map.project([lng, lat]);
        return { xCoord: projectedPoint.x, yCoord: projectedPoint.y };
      });

      let twiceArea = 0;
      let xSum = 0;
      let ySum = 0;
      
      for (let pointIndex = 0; pointIndex < projected.length; pointIndex++) {
        const nextIndex = (pointIndex + 1) % projected.length;
        const crossProduct = projected[pointIndex].xCoord * projected[nextIndex].yCoord - 
                            projected[nextIndex].xCoord * projected[pointIndex].yCoord;
        twiceArea += crossProduct;
        xSum += (projected[pointIndex].xCoord + projected[nextIndex].xCoord) * crossProduct;
        ySum += (projected[pointIndex].yCoord + projected[nextIndex].yCoord) * crossProduct;
      }
      
      const area = twiceArea / 2;
      
      // Handle degenerate case
      if (Math.abs(area) < 1e-6) {
        const average = projected.reduce(
          (accumulator, point) => ({ 
            xCoord: accumulator.xCoord + point.xCoord, 
            yCoord: accumulator.yCoord + point.yCoord 
          }),
          { xCoord: 0, yCoord: 0 }
        );
        const centroidX = average.xCoord / projected.length;
        const centroidY = average.yCoord / projected.length;
        const unprojected = map.unproject([centroidX, centroidY]);
        return { lat: unprojected.lat, lng: unprojected.lng };
      }
      
      // Unproject back to geographic coordinates
      const centroidX = xSum / (6 * area);
      const centroidY = ySum / (6 * area);
      const unprojected = map.unproject([centroidX, centroidY]);
      return { lat: unprojected.lat, lng: unprojected.lng };
    } catch (error) {
      console.log(error);
      return computePolygonCentroid(coords);
    }
  };

  // Initialize shapes from props
  useEffect(() => {
    if (initialShapes.length > 0) {
      const shapes = initialShapes
        .filter((shape) => shape.type !== 'polyline')
        .map(
          (shape, shapeIndex) =>
            ({
              id: `initial_${shape.type}_${shapeIndex}`,
              type: shape.type as 'rectangle' | 'polygon',
              coordinates: shape.coordinates,
              area: (shape as any).area,
              address: (shape as any).address,
            } as ShapeData)
        );
      setDrawnShapes(shapes);

      // Compute centroid for initial polygon
      const polygon = shapes.find((shape) => shape.type === 'polygon');
      if (polygon?.coordinates) {
        const coords = polygon.coordinates as number[][];
        const latLngCoords: [number, number][] = coords.map(([lng, lat]) => [lat, lng]);
        const centroid = computePolygonCentroidProjected(latLngCoords);
        setPolygonCentroid([centroid.lat, centroid.lng]);
      }
    }
  }, [initialShapes]);

  // If we get initialShapes and the map is already ready, ensure they are rendered on the map
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    if (initialShapes.length === 0) return;
    if (readOnly) return;

    const shapes = initialShapes
      .filter((shape) => shape.type !== 'polyline')
      .map(
        (shape, shapeIndex) =>
          ({
            id: `initial_${shape.type}_${shapeIndex}`,
            type: shape.type as 'rectangle' | 'polygon',
            coordinates: shape.coordinates,
            area: (shape as any).area,
            address: (shape as any).address,
          } as ShapeData)
      );

    // Clean up existing layers
    polygonLayersRef.current.forEach((layerId) => {
      try {
        if (!mapRef.current) return;
        if (mapRef.current.getLayer(layerId)) mapRef.current.removeLayer(layerId);
        if (mapRef.current.getLayer(`${layerId}-outline`))
          mapRef.current.removeLayer(`${layerId}-outline`);
        if (mapRef.current.getSource(layerId)) mapRef.current.removeSource(layerId);
      } catch (error) {
        console.log(error);
      }
    });
    polygonLayersRef.current = [];

    // Add shapes to map
    shapes.forEach((shape) => {
      if (shape.type === 'polygon') addPolygonToMap(shape);
    });
  }, [initialShapes, mapReady]);

  // Start drawing mode when requested by parent
  useEffect(() => {
    if (startDrawing !== undefined && startDrawing) {
      setActiveTool('polygon');
      setIsDrawing(true);
    }
  }, [startDrawing]);

  // Keep refs in sync for event listeners attached in callbacks
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);
  
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // Notify parent when currentPath changes
  useEffect(() => {
    onDrawingPathChange?.(currentPath.length);
  }, [currentPath, onDrawingPathChange]);

  // Update polygon centroid when drawn shapes change
  useEffect(() => {
    if (programmaticPanRef.current) {
      return;
    }

    const polygon = drawnShapes.find((shape) => shape.type === 'polygon');
    if (polygon?.coordinates) {
      // Avoid recalculating centroid for the same shape
      if (
        lastCentroidShapeIdRef.current &&
        polygon.id === lastCentroidShapeIdRef.current
      ) {
        lastCentroidShapeIdRef.current = null;
        return;
      }
      const coords = polygon.coordinates as number[][];
      const latLngCoords: [number, number][] = coords.map(([lng, lat]) => [lat, lng]);
      const centroid = computePolygonCentroidProjected(latLngCoords);
      setPolygonCentroid([centroid.lat, centroid.lng]);
    } else {
      setPolygonCentroid(null);
    }
  }, [drawnShapes]);

  /**
   * Handle path click for polygon drawing
   * Adds point to current path if not duplicate
   */
  const handlePathClick = (lat: number, lng: number) => {
    setCurrentPath((previousPath) => {
      const newPoint: [number, number] = [lat, lng];
      const lastPoint = previousPath.at(-1);
      const epsilon = 1e-7;
      
      // Avoid adding duplicate consecutive points
      if (
        lastPoint &&
        Math.abs(lastPoint[0] - newPoint[0]) < epsilon &&
        Math.abs(lastPoint[1] - newPoint[1]) < epsilon
      ) {
        return previousPath;
      }
      
      return [...previousPath, newPoint];
    });
  };

  /**
   * Finish drawing polygon
   * Filters duplicate points, calculates centroid and area, performs reverse geocoding
   */
  const finishShape = async () => {
    if (currentPath.length < 3) return;
    
    const epsilon = 1e-7;
    const filteredPath: [number, number][] = [];
    
    // Remove duplicate consecutive points
    for (const point of currentPath) {
      const lastPoint = filteredPath.at(-1);
      if (lastPoint && 
          Math.abs(lastPoint[0] - point[0]) < epsilon && 
          Math.abs(lastPoint[1] - point[1]) < epsilon) {
        continue;
      }
      filteredPath.push(point);
    }
    
    if (filteredPath.length < 3) return;

    const centroid = computePolygonCentroidProjected(filteredPath);

    setPolygonCentroid([centroid.lat, centroid.lng]);
    setLocationLocked(true);
    onLocationLockChange?.(true);

    // Update marker
    if (mapRef.current) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      addMarkerToMap(centroid.lng, centroid.lat, locatePropertyIcon);
    }

    const tempId = `polygon_${Date.now()}`;
    const shapeData: ShapeData = {
      type: 'polygon',
      coordinates: filteredPath.map(([lat, lng]) => [lng, lat]),
      id: tempId,
      addedAt: new Date().toISOString(),
    };

    const area = calculatePolygonArea(filteredPath);
    shapeData.area = area;

    // Replace existing polygon with new one
    setDrawnShapes((previousShapes) => {
      const nonPolygonShapes = previousShapes.filter((shape) => shape.type !== 'polygon');
      return [...nonPolygonShapes, shapeData];
    });

    lastCentroidShapeIdRef.current = tempId;

    await performReverseGeocoding(tempId, centroid);
    panMapToCentroid(centroid, filteredPath);

    // Reset drawing state
    setCurrentPath([]);
    setActiveTool(null);
    setIsDrawing(false);

    onShapeDrawn?.(shapeData);
  };

  /**
   * Perform reverse geocoding for centroid and update shape
   */
  const performReverseGeocoding = async (
    tempId: string,
    centroid: { lat: number; lng: number }
  ) => {
    try {
      const centroidAddress = await getReverseGeocodedAddress(centroid.lat, centroid.lng);
      setDrawnShapes((previousShapes) =>
        previousShapes.map((shape) => 
          shape.id === tempId ? { ...shape, address: centroidAddress } : shape
        )
      );
      onLocationUpdate(centroid.lat, centroid.lng, centroidAddress);
    } catch (err) {
      console.warn('Reverse geocode failed (async), centroid already shown', err);
      onLocationUpdate(
        centroid.lat,
        centroid.lng,
        `${centroid.lat.toFixed(6)}, ${centroid.lng.toFixed(6)}`
      );
    }
  };

  /**
   * Pan map to centroid with appropriate zoom level based on polygon size
   */
  const panMapToCentroid = (
    centroid: { lat: number; lng: number },
    filteredPath: [number, number][]
  ) => {
    if (!mapRef.current) return;

    programmaticPanRef.current = true;

    // Calculate bounding box to determine zoom level
    const latitudes = filteredPath.map((coord) => coord[0]);
    const longitudes = filteredPath.map((coord) => coord[1]);
    const latDiff = Math.max(...latitudes) - Math.min(...latitudes);
    const lngDiff = Math.max(...longitudes) - Math.min(...longitudes);
    const maxDiff = Math.max(latDiff, lngDiff);

    // Determine appropriate zoom level
    let targetZoom = 20;
    if (maxDiff > 0.01) targetZoom = 15;
    else if (maxDiff > 0.005) targetZoom = 16;
    else if (maxDiff > 0.002) targetZoom = 17;
    else if (maxDiff > 0.001) targetZoom = 18;
    else if (maxDiff > 0.0005) targetZoom = 19;

    mapRef.current.flyTo({
      center: [centroid.lng, centroid.lat],
      zoom: targetZoom,
      essential: true,
      duration: 1000,
    });
  };

  // Expose control methods to parent via externalFinishRef
  useEffect(() => {
    if (externalFinishRef) {
      externalFinishRef.current = {
        finish: () => {
          void finishShape();
        },
        start: () => {
          setActiveTool('polygon');
          setIsDrawing(true);
        },
        clear: () => {
          clearAllShapes();
        },
      };
    }
    return () => {
      if (externalFinishRef) {
        externalFinishRef.current = null;
      }
    };
  }, [externalFinishRef, finishShape]);

  /**
   * Handle map movement end for location updates
   * Debounced reverse geocoding for center position
   */
  const handleMapMoveEnd = () => {
    if (!mapRef.current || readOnly) return;
    if (locationLocked || polygonCentroid) return;

    // Skip if programmatic pan
    if (programmaticPanRef.current) {
      programmaticPanRef.current = false;
      return;
    }

    try {
      const mapCenter = mapRef.current.getCenter();
      const latitude = mapCenter.lat;
      const longitude = mapCenter.lng;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounced reverse geocoding
      debounceTimeoutRef.current = globalThis.setTimeout(async () => {
        try {
          const address = await getReverseGeocodedAddress(latitude, longitude);
          onLocationUpdate(latitude, longitude, address);
        } catch (error) {
          console.error('Error getting address:', error);
          onLocationUpdate(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      }, 1000);
    } catch (error) {
      console.error('Error in handleMapMoveEnd:', error);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc',
      center: [center[1], center[0]],
      zoom: 16,
      attributionControl: false,
      interactive: !readOnly,
    });

    mapRef.current = map;

    if (externalMapRef) {
      externalMapRef.current = map;
    }

    // Add navigation controls for interactive mode
    if (!readOnly) {
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        'bottom-left'
      );
    }

    map.on('moveend', handleMapMoveEnd);

    // Handle movestart to unlock location if manually moved
    map.on('movestart', () => {
      try {
        if (locationLocked && !programmaticPanRef.current) {
          if (!polygonCentroid) {
            setLocationLocked(false);
          }
        }
        onMapMoveStart?.();
      } catch (error) {
        console.log(error);
      }
    });

    // Handle click for polygon drawing
    map.on('click', (event) => {
      try {
        const { lat, lng } = event.lngLat;
        if (activeToolRef.current === 'polygon' && isDrawingRef.current) {
          handlePathClick(lat, lng);
        }
      } catch (err) {
        console.log(err);
      }
    });

    // Set map ready state when loaded
    map.once('load', () => {
      if (map.isStyleLoaded()) {
        setMapReady(true);
      } else {
        map.once('styledata', () => {
          setMapReady(true);
        });
      }
    });

    // Initial reverse geocode for non-readonly mode
    if (!readOnly) {
      setTimeout(() => handleMapMoveEnd(), 2000);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapRef.current && polygonCentroid) {
      const [latitude, longitude] = polygonCentroid;
      mapRef.current.setCenter([longitude, latitude]);
    }
  }, [polygonCentroid]);

  // Render drawn shapes on map
  useEffect(() => {
    if (!mapRef.current || !shapesVisible || !mapReady) return;

    // Wait for style to load
    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once('styledata', () => {
        if (mapRef.current?.isStyleLoaded()) {
          // Clean up existing layers
          polygonLayersRef.current.forEach((layerId) => {
            try {
              if (mapRef.current!.getLayer(layerId)) {
                mapRef.current!.removeLayer(layerId);
              }
              if (mapRef.current!.getLayer(`${layerId}-outline`)) {
                mapRef.current!.removeLayer(`${layerId}-outline`);
              }
              if (mapRef.current!.getSource(layerId)) {
                mapRef.current!.removeSource(layerId);
              }
            } catch (error) {
              console.log(error);
            }
          });
          polygonLayersRef.current = [];

          // Re-add all shapes
          drawnShapes.forEach((shape) => {
            if (shape.type === 'polygon') {
              addPolygonToMap(shape);
            }
          });
        }
      });
      return;
    }

    // Clean up existing layers
    polygonLayersRef.current.forEach((layerId) => {
      try {
        if (!mapRef.current) return;
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getLayer(`${layerId}-outline`)) {
          mapRef.current.removeLayer(`${layerId}-outline`);
        }
        if (mapRef.current.getSource(layerId)) {
          mapRef.current.removeSource(layerId);
        }
      } catch (error) {
        console.log(error);
      }
    });
    polygonLayersRef.current = [];

    // Add shapes to map (skip in readonly mode)
    drawnShapes.forEach((shape) => {
      if (readOnly) return;
      if (shape.type === 'polygon') {
        addPolygonToMap(shape);
      }
    });
  }, [drawnShapes, shapesVisible, readOnly]);

  /**
   * Helper to remove temporary drawing layers
   */
  const removeTempDrawingLayers = (map: maplibregl.Map) => {
    if (map.getLayer('temp-polygon-line')) {
      map.removeLayer('temp-polygon-line');
    }
    if (map.getSource('temp-polygon')) {
      map.removeSource('temp-polygon');
    }
    if (map.getLayer('temp-polygon-vertices')) {
      map.removeLayer('temp-polygon-vertices');
    }
    if (map.getSource('temp-polygon-vertices')) {
      map.removeSource('temp-polygon-vertices');
    }
  };

  /**
   * Helper to update or create polygon line layer
   */
  const updatePolygonLineLayer = (map: maplibregl.Map, geojson: any) => {
    const source = map.getSource('temp-polygon');
    if (source) {
      (source as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource('temp-polygon', {
        type: 'geojson',
        data: geojson,
      });

      map.addLayer({
        id: 'temp-polygon-line',
        type: 'line',
        source: 'temp-polygon',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 3,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2],
        },
      });
    }
  };

  /**
   * Helper to update or create vertices layer
   */
  const updateVerticesLayer = (map: maplibregl.Map, verticesGeoJSON: any) => {
    const verticesSource = map.getSource('temp-polygon-vertices');
    if (verticesSource) {
      (verticesSource as maplibregl.GeoJSONSource).setData(verticesGeoJSON);
    } else {
      map.addSource('temp-polygon-vertices', {
        type: 'geojson',
        data: verticesGeoJSON,
      });

      map.addLayer({
        id: 'temp-polygon-vertices',
        type: 'circle',
        source: 'temp-polygon-vertices',
        paint: {
          'circle-radius': 5,
          'circle-color': '#e86813ff',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
        },
      });
    }
  };

  // Render current drawing path
  useEffect(() => {
    if (!mapRef.current || !isDrawing || currentPath.length < 1) {
      if (mapRef.current) {
        removeTempDrawingLayers(mapRef.current);
      }
      return;
    }

    const map = mapRef.current;
    const pathCoords = currentPath.map(([lat, lng]) => [lng, lat]);
    const coordinates =
      pathCoords.length >= 2 ? [...pathCoords, pathCoords[0]] : pathCoords;

    // Draw line connecting points
    if (pathCoords.length >= 2) {
      const geojson = {
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates,
        },
        properties: {},
      };

      updatePolygonLineLayer(map, geojson);
    }

    // Draw vertices
    const vertexFeatures = pathCoords.map((coord) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: coord },
      properties: {},
    }));
    
    const verticesGeoJSON = {
      type: 'FeatureCollection',
      features: vertexFeatures,
    };

    updateVerticesLayer(map, verticesGeoJSON);
  }, [isDrawing, currentPath]);

  // Render markers (readonly marker and polygon centroid marker)
  useEffect(() => {
    if (!mapRef.current) return;

    const renderMarkers = () => {
      if (!mapRef.current) return;

      const epsilon = 1e-6;
      // Check if marker position needs update
      if (polygonCentroid && markersRef.current.length > 0) {
        try {
          const existingMarker = markersRef.current[0];
          const position = existingMarker.getLngLat();
          const [polygonLatitude, polygonLongitude] = polygonCentroid;
          if (Math.abs(position.lat - polygonLatitude) < epsilon && 
              Math.abs(position.lng - polygonLongitude) < epsilon) {
            return;
          }
        } catch (error) {
          console.log(error);
        }
      }

      // Remove existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add marker based on mode
      if (polygonCentroid) {
        addMarkerToMap(polygonCentroid[1], polygonCentroid[0], locatePropertyIcon);
      } else if (readOnly) {
        addMarkerToMap(center[1], center[0], locatePropertyIcon);
      }
    };

    // Wait for map to be fully loaded
    if (mapRef.current.loaded() && mapRef.current.isStyleLoaded()) {
      renderMarkers();
    } else if (mapRef.current.loaded()) {
      if (mapRef.current.isStyleLoaded()) {
        renderMarkers();
      } else {
        mapRef.current.once('style.load', renderMarkers);
      }
    } else {
      mapRef.current.once('load', () => {
        if (mapRef.current?.isStyleLoaded()) {
          renderMarkers();
        } else {
          mapRef.current?.once('style.load', renderMarkers);
        }
      });
    }
  }, [readOnly, center, polygonCentroid, drawnShapes]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="location-map-container">
      <div
        ref={mapContainerRef}
        className="location-leaflet-map"
        style={{ width: '100%', height: '100%', borderRadius: '20px' }}
      />

      {/* Address overlay for readOnly view */}
      {readOnly && addressLabel && (
        <div className="map-address-overlay" aria-hidden>
          {addressLabel}
        </div>
      )}

      {/* Selection overlay: only when not readOnly and not actively drawing and no polygon centroid exists. 
          This overlay is a DOM element centered over the map and moves visually with the map 
          (user pans map to change selected coordinates). */}
      {!readOnly && !isDrawing && activeTool === null && !polygonCentroid && (
        <div className="center-pin">
          <img
            src={locatePropertyIcon}
            alt="select pin"
            style={{
              width: 36,
              height: 36,
              transform: 'translateY(-6px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LocationMapWithDrawing;
