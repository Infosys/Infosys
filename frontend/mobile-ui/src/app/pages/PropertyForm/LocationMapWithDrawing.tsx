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
import locatePropertyIcon from '../../../assets/CitizenAssets/mycity_page/locateProperty.svg';

interface LocationMapWithDrawingProps {
  center: [number, number];
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  addressLabel?: string;
  onShapeDrawn?: (shapeData: any) => void;
  initialShapes?: Array<{
    type: 'polyline' | 'rectangle' | 'polygon' | 'point';
    coordinates: number[] | number[][];
    area?: number;
  }>;
  readOnly?: boolean;
  // optional external map ref to allow parent to control map (pan/zoom)
  externalMapRef?: React.MutableRefObject<any | null>;
  // external ref to call finish or start from parent
  externalFinishRef?: React.MutableRefObject<{
    finish?: () => void;
    start?: () => void;
    clear?: () => void;
  } | null>;
  onClearAll?: () => void;
  startDrawing?: boolean;
  // notify parent when user starts moving the map (used to hide center instruction)
  onMapMoveStart?: () => void;
  // notify parent when the map locks/unlocks a selected location (true when locked)
  onLocationLockChange?: (locked: boolean) => void;
  // (deprecated) showCenterInstruction removed; center pin overlay is always visible
}

// Shape data interface
interface ShapeData {
  type: 'rectangle' | 'polygon';
  coordinates: number[] | number[][];
  area?: number;
  id: string;
  address?: string;
  addedAt?: string;
}

// Drawing tool types
type DrawingTool = 'polygon' | null;

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
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.properties) {
          const props = feature.properties;
          const parts = [];

          if (props.housenumber) parts.push(props.housenumber);
          if (props.street) parts.push(props.street);
          if (props.district) parts.push(props.district);
          if (props.city) parts.push(props.city);
          if (props.state) parts.push(props.state);

          if (parts.length > 0) {
            return parts.join(', ');
          }

          if (props.name) {
            return props.name;
          }
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
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
  // Clear all drawn shapes and reset selection
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
      // clear remembered centroid shape id
      lastCentroidShapeIdRef.current = null;
    }

    // Notify parent if provided
    if (onLocationLockChange) {
      try {
        onLocationLockChange(false);
      } catch (e) {
        /* ignore */
      }
    }
    if (onClearAll) {
      try {
        onClearAll();
      } catch (e) {
        /* ignore */
      }
    }
  };

  // Calculate polygon area (simple approximation)
  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    return Math.abs(area / 2) * 111320 * 111320; // Rough conversion to square meters
  };

  // Add polygon to map
  const addPolygonToMap = (shape: ShapeData) => {
    if (!mapRef.current || shape.type !== 'polygon') return;

    // Guard: ensure map style is loaded before adding sources/layers
    if (!mapRef.current.isStyleLoaded()) {
      console.warn('Map style not loaded yet, deferring polygon add');
      return;
    }

    const coords = shape.coordinates as number[][];
    const sourceId = shape.id;

    // Convert coordinates to GeoJSON format [lng, lat]
    const coordinates = coords.map(([lng, lat]) => [lng, lat]);
    coordinates.push(coordinates[0]); // Close the polygon

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

    // Add source
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

  // Add marker to map
  const addMarkerToMap = (lng: number, lat: number, iconUrl: string) => {
    if (!mapRef.current) {
      console.warn('Map ref not available when trying to add marker');
      return null;
    }

    // Create image element for the marker
    const img = document.createElement('img');
    img.src = iconUrl;
    img.style.width = '36px';
    img.style.height = '36px';
    img.style.cursor = 'pointer';
    img.alt = 'Location marker';

    // Create wrapper div
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '36px';
    el.style.height = '36px';
    el.appendChild(img);

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
      offset: [0, 0],
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markersRef.current.push(marker);
    return marker;
  };

  // Helper function to compute polygon centroid
  const computePolygonCentroid = (coords: [number, number][]) => {
    // coords are [lat, lng]
    const pts = coords.map(([lat, lng]) => ({ x: lng, y: lat }));
    let twiceArea = 0;
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      const cross = pts[i].x * pts[j].y - pts[j].x * pts[i].y;
      twiceArea += cross;
      xSum += (pts[i].x + pts[j].x) * cross;
      ySum += (pts[i].y + pts[j].y) * cross;
    }
    const area = twiceArea / 2;
    if (Math.abs(area) < 1e-9) {
      // fallback to average of points
      const avg = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
        x: 0,
        y: 0,
      });
      return { lat: avg.y / pts.length, lng: avg.x / pts.length };
    }
    const cx = xSum / (6 * area);
    const cy = ySum / (6 * area);
    return { lat: cy, lng: cx };
  };

  // Compute centroid using map projection (pixel coordinates) for better accuracy
  // on very small polygons. Falls back to geographic centroid if map not ready.
  const computePolygonCentroidProjected = (coords: [number, number][]) => {
    // coords are [lat, lng]
    try {
      const map = mapRef.current;
      if (!map || !map.loaded()) {
        return computePolygonCentroid(coords);
      }

      // Project geographic coordinates to screen (pixel) coordinates
      const projected = coords.map(([lat, lng]) => {
        const p = map.project([lng, lat]);
        return { x: p.x, y: p.y };
      });

      // Compute centroid in projected space
      let twiceArea = 0;
      let xSum = 0;
      let ySum = 0;
      for (let i = 0; i < projected.length; i++) {
        const j = (i + 1) % projected.length;
        const cross = projected[i].x * projected[j].y - projected[j].x * projected[i].y;
        twiceArea += cross;
        xSum += (projected[i].x + projected[j].x) * cross;
        ySum += (projected[i].y + projected[j].y) * cross;
      }
      const area = twiceArea / 2;
      if (Math.abs(area) < 1e-6) {
        // fallback to average
        const avg = projected.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
          x: 0,
          y: 0,
        });
        const cx = avg.x / projected.length;
        const cy = avg.y / projected.length;
        const un = map.unproject([cx, cy]);
        return { lat: un.lat, lng: un.lng };
      }
      const cx = xSum / (6 * area);
      const cy = ySum / (6 * area);

      // Unproject back to geographic coordinates (use array form)
      const un = map.unproject([cx, cy]);
      return { lat: un.lat, lng: un.lng };
    } catch (e) {
      // anything fails, fallback to geographic centroid
      return computePolygonCentroid(coords);
    }
  };

  // Initialize shapes from props
  useEffect(() => {
    if (initialShapes.length > 0) {
      // Filter out any legacy polylines (we no longer support polyline drawing)
      const shapes = initialShapes
        .filter((shape) => shape.type !== 'polyline')
        .map(
          (shape, index) =>
            ({
              id: `initial_${shape.type}_${index}`,
              type: shape.type as 'rectangle' | 'polygon',
              coordinates: shape.coordinates,
              area: (shape as any).area,
              address: (shape as any).address,
            } as ShapeData)
        );
      setDrawnShapes(shapes);

      // If there's a polygon in initial shapes, calculate and set its centroid
      const polygon = shapes.find((shape) => shape.type === 'polygon');
      if (polygon && polygon.coordinates) {
        const coords = polygon.coordinates as number[][];
        // Convert from [lng, lat] to [lat, lng] format for centroid calculation
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

    // Convert incoming shapes same as above
    const shapes = initialShapes
      .filter((shape) => shape.type !== 'polyline')
      .map(
        (shape, index) =>
          ({
            id: `initial_${shape.type}_${index}`,
            type: shape.type as 'rectangle' | 'polygon',
            coordinates: shape.coordinates,
            area: (shape as any).area,
            address: (shape as any).address,
          } as ShapeData)
      );

    // Remove any existing polygon layers first
    polygonLayersRef.current.forEach((layerId) => {
      try {
        if (!mapRef.current) return;
        if (mapRef.current.getLayer(layerId)) mapRef.current.removeLayer(layerId);
        if (mapRef.current.getLayer(`${layerId}-outline`))
          mapRef.current.removeLayer(`${layerId}-outline`);
        if (mapRef.current.getSource(layerId)) mapRef.current.removeSource(layerId);
      } catch (e) {
        // ignore
      }
    });
    polygonLayersRef.current = [];

    shapes.forEach((s) => {
      if (s.type === 'polygon') addPolygonToMap(s);
    });
  }, [initialShapes, mapReady]);

  // start drawing mode when requested by parent
  useEffect(() => {
    if (typeof startDrawing !== 'undefined' && startDrawing) {
      setActiveTool('polygon');
      setIsDrawing(true);
    }
  }, [startDrawing]);

  // keep refs in sync for event listeners attached in callbacks
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // Update polygon centroid when drawn shapes change
  useEffect(() => {
    // If we are programmatically panning the map (flyTo) after finishShape,
    // skip recomputing centroid until the pan finishes to avoid marker jumping.
    if (programmaticPanRef.current) {
      // console.log('Skipping centroid update while programmatic pan is active');
      return;
    }

    const polygon = drawnShapes.find((shape) => shape.type === 'polygon');
    if (polygon && polygon.coordinates) {
      // if the centroid was just set from finishShape for this shape id, skip recomputing to avoid marker jump
      if (
        lastCentroidShapeIdRef.current &&
        polygon.id === lastCentroidShapeIdRef.current
      ) {
        // clear the ref after skipping once so future edits will update centroid
        lastCentroidShapeIdRef.current = null;
        return;
      }
      const coords = polygon.coordinates as number[][];
      // Convert from [lng, lat] to [lat, lng] format for centroid calculation
      const latLngCoords: [number, number][] = coords.map(([lng, lat]) => [lat, lng]);
      const centroid = computePolygonCentroidProjected(latLngCoords);
      setPolygonCentroid([centroid.lat, centroid.lng]);
    } else {
      // No polygon found, clear the centroid
      setPolygonCentroid(null);
    }
  }, [drawnShapes]);

  // Note: point/pin drawing removed - only polygon drawing supported

  // Handle path click (for lines and polygons)
  const handlePathClick = (lat: number, lng: number) => {
    setCurrentPath((prev) => {
      const newPoint: [number, number] = [lat, lng];
      // If last point equals new point (within tiny epsilon), skip adding
      const last = prev[prev.length - 1];
      const eps = 1e-7;
      if (
        last &&
        Math.abs(last[0] - newPoint[0]) < eps &&
        Math.abs(last[1] - newPoint[1]) < eps
      ) {
        return prev;
      }
      const newPath: [number, number][] = [...prev, newPoint];
      return newPath;
    });
  };

  // Finish drawing polygon
  const finishShape = async () => {
    if (currentPath.length < 3) return; // Need at least 3 points for a polygon
    // Remove consecutive near-duplicate points to keep only real vertices
    const eps = 1e-7;
    const filteredPath: [number, number][] = [];
    for (const pt of currentPath) {
      const last = filteredPath[filteredPath.length - 1];
      if (last && Math.abs(last[0] - pt[0]) < eps && Math.abs(last[1] - pt[1]) < eps) {
        continue;
      }
      filteredPath.push(pt);
    }
    if (filteredPath.length < 3) return; // still need 3 unique vertices

    // Compute centroid using projected coordinates (more accurate for tiny polygons)
    const centroid = computePolygonCentroidProjected(filteredPath);

    // Immediately set centroid and show marker so user sees instant feedback
    // console.log('Setting polygon centroid (immediate):', { lat: centroid.lat, lng: centroid.lng });
    setPolygonCentroid([centroid.lat, centroid.lng]);
    setLocationLocked(true);
    if (onLocationLockChange) {
      try {
        onLocationLockChange(true);
      } catch (e) {
        /* ignore */
      }
    }

    // Force-add immediate marker to map (bypass state debounce)
    try {
      if (mapRef.current) {
        // remove any existing markers to avoid duplicates
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        // addMarkerToMap expects [lng, lat]
        addMarkerToMap(centroid.lng, centroid.lat, locatePropertyIcon);
      }
    } catch (e) {
      console.warn('Immediate marker add failed', e);
    }

    // Create shape entry WITHOUT waiting for address (store address after geocode)
    const tempId = `polygon_${Date.now()}`;
    const shapeData: ShapeData = {
      type: 'polygon',
      // store as MapLibre [lng, lat] order
      coordinates: filteredPath.map(([lat, lng]) => [lng, lat]),
      id: tempId,
      // address will be filled after reverse-geocode
      addedAt: new Date().toISOString(),
    };

    // Calculate approximate area for polygon
    const area = calculatePolygonArea(filteredPath);
    shapeData.area = area;

    // Replace any existing polygon with the new one
    setDrawnShapes((prev) => {
      const nonPolygonShapes = prev.filter((shape) => shape.type !== 'polygon');
      return [...nonPolygonShapes, shapeData];
    });

    // remember that this shape id produced the current centroid so drawnShapes effect doesn't override marker
    lastCentroidShapeIdRef.current = tempId;

    // Perform reverse geocoding asynchronously and update the shape & parent afterwards
    (async () => {
      try {
        const centroidAddress = await getReverseGeocodedAddress(
          centroid.lat,
          centroid.lng
        );
        // update the shape with the address
        setDrawnShapes((prev) =>
          prev.map((s) => (s.id === tempId ? { ...s, address: centroidAddress } : s))
        );
        // update parent location with nicer address
        try {
          onLocationUpdate(centroid.lat, centroid.lng, centroidAddress);
        } catch (err) {
          console.warn('onLocationUpdate failed after geocode', err);
        }
      } catch (err) {
        console.warn('Reverse geocode failed (async), centroid already shown', err);
        try {
          onLocationUpdate(
            centroid.lat,
            centroid.lng,
            `${centroid.lat.toFixed(6)}, ${centroid.lng.toFixed(6)}`
          );
        } catch {}
      }
    })();

    // Also pan map directly to centroid now (avoid setView effect interfering with user panning)
    try {
      if (mapRef.current) {
        programmaticPanRef.current = true;

        // Compute zoom as before
        const coords = filteredPath as [number, number][];
        const lats = coords.map((c) => c[0]);
        const lngs = coords.map((c) => c[1]);
        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lngDiff = Math.max(...lngs) - Math.min(...lngs);
        const maxDiff = Math.max(latDiff, lngDiff);

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
      }
    } catch (e) {
      /* ignore */
    }

    // finalize drawing state
    setCurrentPath([]);
    setActiveTool(null);
    setIsDrawing(false);

    // notify parent synchronously that a shape was started/drawn (address may be updated later)
    if (onShapeDrawn) {
      try {
        onShapeDrawn(shapeData);
      } catch (e) {
        /* ignore */
      }
    }
  };

  // Expose control methods to parent via externalFinishRef
  useEffect(() => {
    if (externalFinishRef) {
      try {
        externalFinishRef.current = {
          finish: () => {
            finishShape();
          },
          start: () => {
            setActiveTool('polygon');
            setIsDrawing(true);
          },
          clear: () => {
            clearAllShapes();
          },
        };
      } catch (e) {
        /* ignore */
      }
    }
    return () => {
      if (externalFinishRef) {
        try {
          externalFinishRef.current = null;
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [externalFinishRef, finishShape]);

  // Handle map movement for location updates
  const handleMapMoveEnd = () => {
    if (!mapRef.current || readOnly) return;

    // If location is locked (e.g. after finishing polygon) or a polygon centroid exists, do not update
    if (locationLocked || polygonCentroid) return;

    // Ignore moveend events which were caused by our own programmatic setView
    if (programmaticPanRef.current) {
      programmaticPanRef.current = false;
      return;
    }

    try {
      const mapCenter = mapRef.current.getCenter();
      const lat = mapCenter.lat;
      const lng = mapCenter.lng;

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce the location update
      debounceTimeoutRef.current = window.setTimeout(async () => {
        try {
          const address = await getReverseGeocodedAddress(lat, lng);
          onLocationUpdate(lat, lng, address);
        } catch (error) {
          console.error('Error getting address:', error);
          onLocationUpdate(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      }, 1000); // Increased debounce time to reduce re-renders
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
      center: [center[1], center[0]], // MapLibre uses [lng, lat]
      zoom: 16,
      attributionControl: false,
      interactive: !readOnly,
    });

    mapRef.current = map;

    // Set external ref if provided
    if (externalMapRef) {
      try {
        externalMapRef.current = map;
      } catch (err) {
        /* ignore */
      }
    }

    // Add navigation controls if not readonly
    try {
      if (!readOnly) {
        // show zoom control, hide compass
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          'bottom-left'
        );
      }
    } catch (e) {}

    // Setup event handlers
    map.on('moveend', handleMapMoveEnd);

    map.on('movestart', () => {
      try {
        // If the user starts moving the map after we locked the location (e.g. after finishing polygon),
        // treat this as an explicit user interaction and unlock the location so subsequent moves update location again.
        // Only unlock location if there is no polygon centroid (i.e. selection is not fixed by a marker)
        if (locationLocked && !programmaticPanRef.current) {
          if (!polygonCentroid) {
            setLocationLocked(false);
          }
          // if polygonCentroid exists, keep locationLocked=true so marker/selection remains fixed
        }
        if (typeof onMapMoveStart === 'function') {
          onMapMoveStart();
        }
      } catch (e) {
        /* ignore */
      }
    });

    // Handle map clicks for polygon drawing
    map.on('click', (e) => {
      try {
        const { lat, lng } = e.lngLat;
        if (activeToolRef.current === 'polygon' && isDrawingRef.current) {
          handlePathClick(lat, lng);
        }
      } catch (err) {
        /* ignore */
      }
    });

    // Wait for map load and style readiness before marking ready
    map.once('load', () => {
      if (map.isStyleLoaded()) {
        setMapReady(true);
      } else {
        // If style not ready yet, wait for styledata
        map.once('styledata', () => {
          setMapReady(true);
        });
      }
    });

    // Initial address load
    if (!readOnly) {
      setTimeout(() => handleMapMoveEnd(), 2000);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center when center prop changes (for polygon centroid)
  useEffect(() => {
    if (mapRef.current && polygonCentroid) {
      // Only update if we have a polygon centroid
      const [lat, lng] = polygonCentroid;
      mapRef.current.setCenter([lng, lat]);
    }
  }, [polygonCentroid]);

  // Render drawn shapes on map
  useEffect(() => {
    if (!mapRef.current || !shapesVisible || !mapReady) return;

    // Guard: wait for style to be loaded before rendering shapes
    if (!mapRef.current.isStyleLoaded()) {
      // Wait for style to be ready, then clean up any old polygon layers/sources and add current shapes
      mapRef.current.once('styledata', () => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          // First, remove all existing polygon layers/sources that we manage
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
            } catch (e) {
              // Ignore errors during cleanup
            }
          });
          polygonLayersRef.current = [];

          // Then add all current shapes
          drawnShapes.forEach((shape) => {
            if (shape.type === 'polygon') {
              addPolygonToMap(shape);
            }
          });
        }
      });
      return;
    }

    // Style already loaded: ensure old layers removed, then add current shapes
    // (cleanup in case sources/layers exist from prior renders)
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
      } catch (e) {
        /* ignore */
      }
    });
    polygonLayersRef.current = [];

    drawnShapes.forEach((shape) => {
      if (readOnly) return;
      if (shape.type === 'polygon') {
        addPolygonToMap(shape);
      }
    });
  }, [drawnShapes, shapesVisible, readOnly]);

  // Render current drawing path
  useEffect(() => {
    if (!mapRef.current || !isDrawing || currentPath.length < 1) {
      // Remove temporary drawing layer if exists
      if (mapRef.current?.getLayer('temp-polygon-line')) {
        mapRef.current.removeLayer('temp-polygon-line');
      }
      if (mapRef.current?.getSource('temp-polygon')) {
        mapRef.current.removeSource('temp-polygon');
      }
      if (mapRef.current?.getLayer('temp-polygon-vertices')) {
        mapRef.current.removeLayer('temp-polygon-vertices');
      }
      if (mapRef.current?.getSource('temp-polygon-vertices')) {
        mapRef.current.removeSource('temp-polygon-vertices');
      }
      return;
    }

    const map = mapRef.current;
    const pathCoords = currentPath.map(([lat, lng]) => [lng, lat]);
    const coordinates =
      pathCoords.length >= 2 ? [...pathCoords, pathCoords[0]] : pathCoords;

    if (pathCoords.length >= 2) {
      const geojson = {
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates,
        },
        properties: {},
      };

      if (!map.getSource('temp-polygon')) {
        map.addSource('temp-polygon', {
          type: 'geojson',
          data: geojson as any,
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
      } else {
        (map.getSource('temp-polygon') as maplibregl.GeoJSONSource).setData(
          geojson as any
        );
      }
    }
    // Create/update a GeoJSON source for vertices
    const vertexFeatures = pathCoords.map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: c },
      properties: {},
    }));
    const verticesGeoJSON = {
      type: 'FeatureCollection',
      features: vertexFeatures,
    };

    if (!map.getSource('temp-polygon-vertices')) {
      map.addSource('temp-polygon-vertices', {
        type: 'geojson',
        data: verticesGeoJSON as any,
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
    } else {
      (map.getSource('temp-polygon-vertices') as maplibregl.GeoJSONSource).setData(
        verticesGeoJSON as any
      );
    }
  }, [isDrawing, currentPath]);

  // Render markers (readonly marker and polygon centroid marker)
  useEffect(() => {
    if (!mapRef.current) return;

    const renderMarkers = () => {
      if (!mapRef.current) return;

      // console.log('Rendering markers - readOnly:', readOnly, 'polygonCentroid:', polygonCentroid);

      // If we already added an immediate centroid marker and it's at the same position,
      // keep it to avoid a visual jump. Compare approx equality within epsilon.
      const eps = 1e-6;
      if (polygonCentroid && markersRef.current.length > 0) {
        try {
          const existing = markersRef.current[0];
          const pos = existing.getLngLat(); // {lng, lat}
          const [plat, plng] = polygonCentroid;
          if (Math.abs(pos.lat - plat) < eps && Math.abs(pos.lng - plng) < eps) {
            // console.log('Existing marker matches centroid — reusing to avoid jump');
            return; // nothing to do
          }
        } catch (e) {
          // fall through to re-create markers
        }
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // If a polygon centroid exists, prefer showing a marker at the centroid
      if (polygonCentroid) {
        // console.log('Adding marker at polygon centroid:', polygonCentroid);
        // polygonCentroid is [lat, lng], so we need [lng, lat] for MapLibre
        addMarkerToMap(polygonCentroid[1], polygonCentroid[0], locatePropertyIcon);
      } else if (readOnly) {
        // No polygon centroid available, fall back to center for readonly view
        // console.log('Adding readonly marker at center (fallback):', center);
        addMarkerToMap(center[1], center[0], locatePropertyIcon);
      }
    };

    // For MapLibre, we need to wait for both 'load' and 'style.load' events
    if (mapRef.current.loaded() && mapRef.current.isStyleLoaded()) {
      renderMarkers();
    } else if (mapRef.current.loaded()) {
      // Map is loaded but style might not be
      if (mapRef.current.isStyleLoaded()) {
        renderMarkers();
      } else {
        mapRef.current.once('style.load', renderMarkers);
      }
    } else {
      // Map not loaded yet
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
    // Reference onClearAll so TypeScript doesn't warn if it's unused
    if (typeof onClearAll === 'undefined') {
      // noop
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Note: we avoid forcing setView on every center change to not fight user panning.
  // finishShape will pan the map to centroid when needed.

  // Note: movestart is wired in the MapContainer ref callback if onMapMoveStart is provided

  return (
    <div className="location-map-container">
      <div
        ref={mapContainerRef}
        className="location-leaflet-map"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Address overlay for readOnly view */}
      {readOnly && addressLabel && (
        <div className="map-address-overlay" aria-hidden>
          {addressLabel}
        </div>
      )}

      {/* Selection overlay: only when not readOnly and not actively drawing and no polygon centroid exists. This overlay is a DOM element
            centered over the map and moves visually with the map (user pans map to change selected coordinates). */}
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
