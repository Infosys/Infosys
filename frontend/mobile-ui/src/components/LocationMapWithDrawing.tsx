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

// Constants
const COORDINATE_EPSILON = 1e-7;
const AREA_EPSILON = 1e-9;
const GEOCODE_DEBOUNCE_MS = 1000;
const MAP_ZOOM_LEVEL = 16;
const MARKER_SIZE = 36;
const PAN_DURATION = 500;

// Props types adjusted to be generic (no Leaflet dependency)
interface LocationMapWithDrawingProps {
  center: [number, number];
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
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

const buildAddressParts = (props: GeoJsonProperties | null): string[] => {
  const parts: string[] = [];
  if (!props) return parts;
  if (props.housenumber) parts.push(props.housenumber);
  if (props.street) parts.push(props.street);
  if (props.district) parts.push(props.district);
  if (props.city) parts.push(props.city);
  if (props.state) parts.push(props.state);
  return parts;
};

const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`
    );
    if (!response.ok) {
      return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }
    
    const data = await response.json();
    const features = data.features;
    if (!features?.length) {
      return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }

    const props = features[0].properties || {};
    const parts = buildAddressParts(props);
    
    if (parts.length) return parts.join(', ');
    if (props.name) return props.name;
    
    return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  } catch {
    return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  }
};

const LocationMapWithDrawing: React.FC<LocationMapWithDrawingProps> = ({
  center,
  onLocationUpdate,
  onShapeDrawn,
  initialShapes = [],
  readOnly = false,
  externalMapRef,
  externalFinishRef,
  onClearAll,
  startDrawing,
  onMapMoveStart,
  onLocationLockChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  
  const createMarkerElement = (iconSrc: string, size = MARKER_SIZE) => {
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
    
    if (Math.abs(area) < AREA_EPSILON) {
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
      zoom: MAP_ZOOM_LEVEL,
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
    const onMapClick = (event: maplibregl.MapMouseEvent) => {
      const longitude = event.lngLat.lng;
      const latitude = event.lngLat.lat;
      
      if (activeToolRef.current === 'polygon' && isDrawingRef.current) {
        setCurrentPath((previousPath) => {
          const lastPoint = previousPath.at(-1);
          if (lastPoint && 
              Math.abs(lastPoint[0] - latitude) < COORDINATE_EPSILON && 
              Math.abs(lastPoint[1] - longitude) < COORDINATE_EPSILON) {
            return previousPath;
          }
          return [...previousPath, [latitude, longitude]];
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
      const latitude = centerLngLat.lat;
      const longitude = centerLngLat.lng;
      
      if (debounceTimeoutRef.current) {
        globalThis.clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = globalThis.setTimeout(async () => {
        try {
          const address = await getReverseGeocodedAddress(latitude, longitude);
          onLocationUpdate(latitude, longitude, address);
        } catch {
          onLocationUpdate(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      }, GEOCODE_DEBOUNCE_MS);
    };
    map.on('moveend', onMoveEnd);

    // movestart unlock handling
    const onMoveStart = () => {
      if (locationLocked && !programmaticPanRef.current) {
        setLocationLocked(false);
        onLocationLockChange?.(false);
      }
      onMapMoveStart?.();
    };
    map.on('movestart', onMoveStart);

    // expose map to parent
    if (externalMapRef) externalMapRef.current = map;

    // cleanup
    return () => {
      map.off('click', onMapClick);
      map.off('moveend', onMoveEnd);
      map.off('movestart', onMoveStart);
      if (debounceTimeoutRef.current) globalThis.clearTimeout(debounceTimeoutRef.current);
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
      .filter((shape) => shape.type !== 'polyline')
      .map((shape, shapeIndex) => ({
        id: `initial_${shape.type}_${shapeIndex}`,
        type: 'polygon' as const,
        coordinates: shape.coordinates,
        area: (shape as ShapeData).area,
        address: (shape as ShapeData).address,
      }));
    
    setDrawnShapes(shapes);
    
    const polygon = shapes.find((shape) => shape.type === 'polygon');
    if (polygon?.coordinates) {
      const coords = polygon.coordinates as number[][];
      const latLngCoords = coords.map(([lng, lat]) => [lat, lng] as [number, number]);
      const centroid = computePolygonCentroid(latLngCoords);
      setPolygonCentroid([centroid.lat, centroid.lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialShapes]);

  // Keep map sources in sync with drawnShapes
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    
    const features: Feature<Polygon, GeoJsonProperties>[] = drawnShapes.map((shape) => {
      const coords = (shape.coordinates as number[][]).map(([lng, lat]) => [lng, lat]);
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: { id: shape.id, address: shape.address, area: shape.area },
      } as Feature<Polygon, GeoJsonProperties>;
    });
    
    const geoJsonCollection: FeatureCollection<Polygon, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features,
    };
    
    const source = map.getSource('drawnShapes') as maplibregl.GeoJSONSource;
    source?.setData(geoJsonCollection as GeoJSON.GeoJSON);
  }, [drawnShapes]);

  // Update currentPath source (line) while drawing
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    
    const source = map.getSource('currentPath') as maplibregl.GeoJSONSource;

    if (currentPath.length === 0) {
      const emptyGeoJson: FeatureCollection<LineString, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: [],
      };
      source?.setData(emptyGeoJson as GeoJSON.GeoJSON);
      return;
    }
    
    const coords = currentPath.map(([lat, lng]) => [lng, lat]);
    const lineFeature: Feature<LineString, GeoJsonProperties> = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    };
    
    const geoJsonCollection: FeatureCollection<LineString, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [lineFeature],
    };
    
    source?.setData(geoJsonCollection as GeoJSON.GeoJSON);
  }, [currentPath]);

  // finish drawing and create polygon
  const finishShape = async () => {
    if (currentPath.length < 3) return;
    
    const filteredPoints: [number, number][] = [];
    for (const point of currentPath) {
      const lastPoint = filteredPoints.at(-1);
      if (lastPoint && 
          Math.abs(lastPoint[0] - point[0]) < COORDINATE_EPSILON && 
          Math.abs(lastPoint[1] - point[1]) < COORDINATE_EPSILON) {
        continue;
      }
      filteredPoints.push(point);
    }
    
    if (filteredPoints.length < 3) return;
    
    const centroid = computePolygonCentroid(filteredPoints);
    const centroidAddress = await getReverseGeocodedAddress(centroid.lat, centroid.lng);
    const area = calculatePolygonArea(filteredPoints);
    
    const shapeData: ShapeData = {
      type: 'polygon',
      coordinates: filteredPoints.map(([lat, lng]) => [lng, lat]),
      id: `polygon_${Date.now()}`,
      address: centroidAddress,
      addedAt: new Date().toISOString(),
      area,
    };
    
    setDrawnShapes((previousShapes) => [...previousShapes, shapeData]);
    setPolygonCentroid([centroid.lat, centroid.lng]);
    setLocationLocked(true);
    onLocationLockChange?.(true);
    onShapeDrawn?.(shapeData);
    onLocationUpdate(centroid.lat, centroid.lng, centroidAddress);
    
    // pan map to centroid programmatically
    if (mapRef.current) {
      programmaticPanRef.current = true;
      mapRef.current.easeTo({ 
        center: [centroid.lng, centroid.lat], 
        duration: PAN_DURATION 
      });
    }
    
    setCurrentPath([]);
    setActiveTool(null);
    setIsDrawing(false);
  };

  // Wire externalFinishRef
  useEffect(() => {
    if (externalFinishRef) {
      externalFinishRef.current = {
        finish: () => { void finishShape(); },
        start: () => {
          setActiveTool('polygon');
          setIsDrawing(true);
        },
        clear: () => {
          setDrawnShapes([]);
          setCurrentPath([]);
          setPolygonCentroid(null);
          setLocationLocked(false);
          onLocationLockChange?.(false);
          onClearAll?.();
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
    if (startDrawing) {
      setActiveTool('polygon');
      setIsDrawing(true);
    }
  }, [startDrawing]);

  // Keep markers (read-only marker and centroid marker) synchronized with map & coordinates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ensureReadOnlyMarker = () => {
      const coordinates = { lat: center[0], lng: center[1] };
      
      if (!readOnly) {
        if (readOnlyMarkerRef.current) {
          readOnlyMarkerRef.current.remove();
          readOnlyMarkerRef.current = null;
        }
        return;
      }
      
      const element = createMarkerElement(locatePropertyIcon, 36);
      
      if (readOnlyMarkerRef.current) {
        readOnlyMarkerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      } else {
        readOnlyMarkerRef.current = new maplibregl.Marker({
          element,
          anchor: 'bottom',
        })
          .setLngLat([coordinates.lng, coordinates.lat])
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
      
      const coordinates = { lat: polygonCentroid[0], lng: polygonCentroid[1] };
      const element = createMarkerElement(locatePropertyIcon, 36);
      
      if (centroidMarkerRef.current) {
        centroidMarkerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      } else {
        centroidMarkerRef.current = new maplibregl.Marker({
          element,
          anchor: 'bottom',
        })
          .setLngLat([coordinates.lng, coordinates.lat])
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
  }, [mapRef.current, readOnly, center, polygonCentroid]);

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        globalThis.clearTimeout(debounceTimeoutRef.current);
      }
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
    </div>
  );
};

export default LocationMapWithDrawing;
