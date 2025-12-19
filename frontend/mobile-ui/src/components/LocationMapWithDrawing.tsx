// LocationMapWithDrawing.tsx
// Renders a MapLibre map with polygon drawing, centroid calculation, and reverse geocoding.
// Supports both interactive and read-only modes, and exposes drawing controls to parent via refs.
import React, { useState, useEffect, useRef } from 'react';
import type {
  Feature,
  FeatureCollection,
  Polygon,
  LineString,
  GeoJsonProperties,
} from 'geojson';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/CustomDrawingToolbar.css';

import locatePropertyIcon from '../app/assets/Agent/PropertyMarker.svg';

const MAPTILER_STYLE =
  'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc';

// Props types adjusted to be generic (no Leaflet dependency)
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
  externalMapRef?: React.MutableRefObject<any | null>;
  externalFinishRef?: React.MutableRefObject<{
    finish?: () => void;
    start?: () => void;
    clear?: () => void;
  } | null>;
  onClearAll?: () => void;
  startDrawing?: boolean;
  onMapMoveStart?: () => void;
  onLocationLockChange?: (locked: boolean) => void;
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

const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties || {};
        const parts: string[] = [];
        if (props.housenumber) parts.push(props.housenumber);
        if (props.street) parts.push(props.street);
        if (props.district) parts.push(props.district);
        if (props.city) parts.push(props.city);
        if (props.state) parts.push(props.state);
        if (parts.length) return parts.join(', ');
        if (props.name) return props.name;
      }
    }
  } catch (e) {
    console.warn('Geocoding failed', e);
  }
  return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
};

const LocationMapWithDrawing: React.FC<LocationMapWithDrawingProps> = ({
  center,
  onLocationUpdate,
  onShapeDrawn,
  initialShapes = [],
  readOnly = false,
  // addressLabel,
  externalMapRef,
  externalFinishRef,
  onClearAll,
  startDrawing,
  onMapMoveStart,
  onLocationLockChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const programmaticPanRef = useRef<boolean>(false);
  const [activeTool, setActiveTool] = useState<DrawingTool>(null);
  const isDrawingRef = useRef<boolean>(false);
  const activeToolRef = useRef<DrawingTool>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState<ShapeData[]>([]);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [polygonCentroid, setPolygonCentroid] = useState<[number, number] | null>(null);
  const [locationLocked, setLocationLocked] = useState(false);

  // Marker refs for MapLibre markers that are tied to geocoordinates
  const readOnlyMarkerRef = useRef<maplibregl.Marker | null>(null);
  const centroidMarkerRef = useRef<maplibregl.Marker | null>(null);
  const createMarkerElement = (iconSrc: string, size = 36) => {
    const wrapper = document.createElement('div');
    wrapper.style.lineHeight = '0';
    wrapper.style.pointerEvents = 'auto';
    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = 'marker';
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    wrapper.appendChild(img);
    return wrapper;
  };

  // helpers
  const computePolygonCentroid = (coords: [number, number][]) => {
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

  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    return Math.abs(area / 2) * 111320 * 111320;
  };

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAPTILER_STYLE,
      center: [center[1], center[0]],
      zoom: 16,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // add empty sources/layers for drawn shapes and current path
    map.on('load', () => {
      if (!map.getSource('drawnShapes')) {
        map.addSource('drawnShapes', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
        map.addLayer({
          id: 'drawnShapes-fill',
          type: 'fill',
          source: 'drawnShapes',
          paint: { 'fill-color': '#C84C0E', 'fill-opacity': 0.15 },
        });
        map.addLayer({
          id: 'drawnShapes-line',
          type: 'line',
          source: 'drawnShapes',
          paint: { 'line-color': '#7f1d1d', 'line-width': 3 },
        });
      }
      if (!map.getSource('currentPath')) {
        map.addSource('currentPath', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
        map.addLayer({
          id: 'currentPath-line',
          type: 'line',
          source: 'currentPath',
          paint: { 'line-color': '#f59e0b', 'line-width': 3, 'line-dasharray': [2, 2] },
        });
      }
    });

    // click handler
    const onMapClick = (e: maplibregl.MapMouseEvent) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      if (activeToolRef.current === 'polygon' && isDrawingRef.current) {
        setCurrentPath((prev) => {
          const last = prev[prev.length - 1];
          const eps = 1e-7;
          if (last && Math.abs(last[0] - lat) < eps && Math.abs(last[1] - lng) < eps)
            return prev;
          return [...prev, [lat, lng]];
        });
      }
    };
    map.on('click', onMapClick);

    // moveend handler for reverse geocode updates (debounced)
    const onMoveEnd = () => {
      if (!mapRef.current || readOnly) return;
      if (programmaticPanRef.current) {
        programmaticPanRef.current = false;
        return;
      }
      const centerLngLat = map.getCenter();
      const lat = centerLngLat.lat;
      const lng = centerLngLat.lng;
      if (debounceTimeoutRef.current) window.clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = window.setTimeout(async () => {
        try {
          const address = await getReverseGeocodedAddress(lat, lng);
          onLocationUpdate(lat, lng, address);
        } catch (err) {
          onLocationUpdate(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      }, 1000);
    };
    map.on('moveend', onMoveEnd);

    // movestart unlock handling
    const onMoveStart = () => {
      try {
        if (locationLocked && !programmaticPanRef.current) {
          setLocationLocked(false);
          if (onLocationLockChange) onLocationLockChange(false);
        }
        if (typeof onMapMoveStart === 'function') onMapMoveStart();
      } catch (e) {
        /* ignore */
      }
    };
    map.on('movestart', onMoveStart);

    // expose map to parent
    if (externalMapRef) externalMapRef.current = map;

    // cleanup
    return () => {
      map.off('click', onMapClick);
      map.off('moveend', onMoveEnd);
      map.off('movestart', onMoveStart);
      if (debounceTimeoutRef.current) window.clearTimeout(debounceTimeoutRef.current);
      if (externalMapRef) externalMapRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep refs in sync
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // Load initialShapes into drawnShapes state and compute centroid
  useEffect(() => {
    if (!initialShapes || initialShapes.length === 0) return;
    const shapes = initialShapes
      .filter((s) => s.type !== 'polyline')
      .map(
        (s, i) =>
          ({
            id: `initial_${s.type}_${i}`,
            type: s.type === 'polygon' ? 'polygon' : 'polygon',
            coordinates: s.coordinates,
            area: (s as any).area,
            address: (s as any).address,
          } as ShapeData)
      );
    setDrawnShapes(shapes);
    const polygon = shapes.find((sh) => sh.type === 'polygon');
    if (polygon && polygon.coordinates) {
      const coords = polygon.coordinates as number[][];
      const latLngCoords = coords.map(([lng, lat]) => [lat, lng]) as [number, number][];
      const centroid = computePolygonCentroid(latLngCoords);
      setPolygonCentroid([centroid.lat, centroid.lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialShapes]);

  // Keep map sources in sync with drawnShapes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const features: Feature<Polygon, GeoJsonProperties>[] = drawnShapes.map((shape) => {
      const coords = (shape.coordinates as number[][]).map(([lng, lat]) => [lng, lat]);
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: { id: shape.id, address: shape.address, area: shape.area },
      } as Feature<Polygon, GeoJsonProperties>;
    });
    const geo: FeatureCollection<Polygon, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features,
    };
    const src = map.getSource('drawnShapes') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(geo as any);
    }
  }, [drawnShapes]);

  // Update currentPath source (line) while drawing
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const src = map.getSource('currentPath') as maplibregl.GeoJSONSource | undefined;

    if (currentPath.length === 0) {
      const emptyGeo: FeatureCollection<LineString, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: [],
      };
      if (src) src.setData(emptyGeo as any);
      return;
    }
    const coords = currentPath.map(([lat, lng]) => [lng, lat]);
    const lineFeature: Feature<LineString, GeoJsonProperties> = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    };
    const geo: FeatureCollection<LineString, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [lineFeature],
    };
    if (src) src.setData(geo as any);
  }, [currentPath]);

  // finish drawing and create polygon
  const finishShape = async () => {
    if (currentPath.length < 3) return;
    const eps = 1e-7;
    const filtered: [number, number][] = [];
    for (const pt of currentPath) {
      const last = filtered[filtered.length - 1];
      if (last && Math.abs(last[0] - pt[0]) < eps && Math.abs(last[1] - pt[1]) < eps)
        continue;
      filtered.push(pt);
    }
    if (filtered.length < 3) return;
    const centroid = computePolygonCentroid(filtered);
    const centroidAddress = await getReverseGeocodedAddress(centroid.lat, centroid.lng);
    const shapeData: ShapeData = {
      type: 'polygon',
      coordinates: filtered.map(([lat, lng]) => [lng, lat]),
      id: `polygon_${Date.now()}`,
      address: centroidAddress,
      addedAt: new Date().toISOString(),
    };
    const area = calculatePolygonArea(filtered);
    shapeData.area = area;
    setDrawnShapes((prev) => [...prev, shapeData]);
    setPolygonCentroid([centroid.lat, centroid.lng]);
    setLocationLocked(true);
    if (onLocationLockChange) onLocationLockChange(true);
    if (onShapeDrawn) onShapeDrawn(shapeData);
    try {
      onLocationUpdate(centroid.lat, centroid.lng, centroidAddress);
    } catch (e) {
      console.log(e);

      /* ignore */
    }
    // pan map to centroid programmatically
    try {
      if (mapRef.current) {
        programmaticPanRef.current = true;
        mapRef.current.easeTo({ center: [centroid.lng, centroid.lat], duration: 500 });
      }
    } catch (e) {
      console.log(e);
    }
    setCurrentPath([]);
    setActiveTool(null);
    setIsDrawing(false);
  };

  // Wire externalFinishRef
  useEffect(() => {
    if (externalFinishRef) {
      externalFinishRef.current = {
        finish: () => finishShape(),
        start: () => {
          setActiveTool('polygon');
          setIsDrawing(true);
        },
        clear: () => {
          setDrawnShapes([]);
          setCurrentPath([]);
          setPolygonCentroid(null);
          setLocationLocked(false);
          if (onLocationLockChange) onLocationLockChange(false);
          if (onClearAll) onClearAll();
        },
      };
    }
    return () => {
      if (externalFinishRef) externalFinishRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, drawnShapes]);

  // start drawing if requested
  useEffect(() => {
    if (typeof startDrawing !== 'undefined' && startDrawing) {
      setActiveTool('polygon');
      setIsDrawing(true);
    }
  }, [startDrawing]);

  // Keep markers (read-only marker and centroid marker) synchronized with map & coordinates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ensureReadOnlyMarker = () => {
      const coords = { lat: center[0], lng: center[1] };
      if (!readOnly) {
        if (readOnlyMarkerRef.current) {
          readOnlyMarkerRef.current.remove();
          readOnlyMarkerRef.current = null;
        }
        return;
      }
      const el = createMarkerElement(locatePropertyIcon, 36);
      if (readOnlyMarkerRef.current) {
        readOnlyMarkerRef.current.setLngLat([coords.lng, coords.lat]);
      } else {
        readOnlyMarkerRef.current = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
      }
    };

    const ensureCentroidMarker = () => {
      if (!polygonCentroid) {
        if (centroidMarkerRef.current) {
          centroidMarkerRef.current.remove();
          centroidMarkerRef.current = null;
        }
        return;
      }
      const coords = { lat: polygonCentroid[0], lng: polygonCentroid[1] };
      const el = createMarkerElement(locatePropertyIcon, 36);
      if (centroidMarkerRef.current) {
        centroidMarkerRef.current.setLngLat([coords.lng, coords.lat]);
      } else {
        centroidMarkerRef.current = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
      }
    };

    // If style not loaded yet, wait for load event
    if (!map.isStyleLoaded()) {
      const onLoad = () => {
        ensureReadOnlyMarker();
        ensureCentroidMarker();
      };
      map.once('load', onLoad);
      return () => {
        map.off('load', onLoad);
      };
    }

    ensureReadOnlyMarker();
    ensureCentroidMarker();

    // cleanup on unmount or when dependencies change
    return () => {
      // keep markers if they should persist until explicitly removed by their own effects
    };
  }, [mapRef.current, readOnly, center, polygonCentroid]);

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) window.clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // render
  return (
    <div className="location-map-container" style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
        data-testid="maplibre-map"
      />
      {/* Marker elements are rendered as maplibre-gl Markers bound to coordinates (see effect above) */}
    </div>
  );
};

export default LocationMapWithDrawing;
