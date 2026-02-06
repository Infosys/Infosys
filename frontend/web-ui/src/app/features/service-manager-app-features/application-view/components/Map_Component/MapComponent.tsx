import React, { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, IconButton } from "@mui/material";
import closeSvg from "../../Assets/MapMarkerIcon/close.svg";
import undoSvg from "../../Assets/MapMarkerIcon/undo.svg";
import editSquareSvg from "../../Assets/MapMarkerIcon/edit_squaremap.svg";
import propertyMarkerSvg from '../../Assets/MapMarkerIcon/Proptery one.svg';
import { useReplaceGisCoordinatesMutation } from '../../api/GisDataAPI';
import {
  mapComponentOuterStyle,
  mapWrapperContainerStyle,
  mapDivStyle,
  mapOverlayStyle,
  mapButtonPanelStyle,
  mapButtonStyle,
  mapIconButtonStyle,
  mapUndoButtonStyle,
} from "../../Styles/searchPropertyStyles/MapComponent";
import type { Property } from '../../model/applicationByIdModel';
import { useAuth } from '../../../../login-signup/provider/AuthProvider';
import { usePostApplicationLogMutation } from '../../api/applicationApi';

/**
 * Type definition for polygon drawing controls exposed to parent component
 */
type PolygonControlRef = { 
  start?: () => void;      // Start drawing mode
  finish?: () => void;     // Finish and save polygon
  clear?: (notify?: boolean) => void;  // Clear all drawings
  undo?: () => void        // Undo last point
} | null;

/**
 * Props interface for MapWrapper component
 */
type MapWrapperProps = Readonly<{
  interactive: boolean;  // Enable/disable map interactions (pan, zoom)
  coordinates?: Array<{ Latitude?: number; Longitude?: number; latitude?: number; longitude?: number }> | null;
  externalControlRef?: React.RefObject<PolygonControlRef>;  // Ref for parent to control polygon drawing 
  onPolygonComplete?: (coords: Array<{ lat: number; lng: number }>) => void;  // Callback when polygon drawing completes
  locationMode?: boolean;  // Special mode for single point editing
  onLocationMove?: (lat: number, lng: number) => void;  // Live callback for map center changes
  initialCenter?: { lat: number; lng: number } | null;  // Initial map center for location mode
}>;

/**
 * MapWrapper Component
 * 
 * Core map rendering component using MapLibre GL
 * Handles both static display and interactive drawing modes
 * 
 * Features:
 * - Display single points, multiple points, or polygons
 * - Interactive polygon drawing with visual feedback
 * - Location editing mode with live center updates
 * - Centroid calculation for polygons
 */
export function MapWrapper({
  interactive,
  coordinates,
  externalControlRef,
  onPolygonComplete,
  locationMode,
  onLocationMove,
  initialCenter,
}: MapWrapperProps) {
  // DOM and MapLibre instance references
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  
  // Drawing state references
  const initialLocationSentRef = useRef(false);  // Prevents duplicate initial location callbacks
  const drawingPointsRef = useRef<[number, number][]>([]);  // Points being drawn
  const tempMarkersRef = useRef<L.Layer[]>([]);  // Temporary point markers during drawing
  const drawnLayersRef = useRef<L.Layer[]>([]);  // Final drawn layers (polygons, markers)

  /**
   * Parse coordinates from props into standardized format
   */
  const parseCoordinates = useCallback((): [number, number][] => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return [];
    }
    return coordinates.map((c) => [
      c.Latitude ?? c.latitude ?? 0,
      c.Longitude ?? c.longitude ?? 0
    ] as [number, number]);
  }, [coordinates]);

  /**
   * Determine initial map center based on mode and available coordinates
   */
  const getInitialCenter = useCallback((points: [number, number][]): [number, number] => {
    if (locationMode && initialCenter) {
      return [initialCenter.lat, initialCenter.lng];
    }
    if (points.length > 0) {
      return points[0];
    }
    return [12.9141, 77.6387]; // Default: Bangalore
  }, [locationMode, initialCenter]);

  /**
   * Create custom marker element for map
   */
  const createCustomMarkerElement = useCallback(() => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '34px';
    wrapper.style.height = '34px';
    wrapper.style.position = 'relative';
    wrapper.style.pointerEvents = 'none';

    const img = document.createElement('img');
    img.src = propertyMarkerSvg;
    img.style.width = '34px';
    img.style.height = '34px';
    img.style.position = 'absolute';
    img.style.left = '50%';
    img.style.bottom = '0';
    img.style.transform = 'translateX(-50%)';
    img.style.display = 'block';
    img.style.margin = '0';
    img.style.padding = '0';

    wrapper.appendChild(img);
    return wrapper;
  }, []);

  /**
   * Calculate visual centroid using pixel space
   */
  const calculateVisualCentroid = useCallback((
    map: maplibregl.Map,
    points: [number, number][]
  ) => {
    try {
      const layerPts = points.map(p => map.project([p[1], p[0]]));
      let signedArea = 0;
      let cx = 0;
      let cy = 0;
      
      for (let i = 0; i < layerPts.length; i++) {
        const p0 = layerPts[i];
        const p1 = layerPts[(i + 1) % layerPts.length];
        const a = p0.x * p1.y - p1.x * p0.y;
        signedArea += a;
        cx += (p0.x + p1.x) * a;
        cy += (p0.y + p1.y) * a;
      }
      
      signedArea *= 0.5;
      
      if (Math.abs(signedArea) < 1e-6) {
        const avgX = layerPts.reduce((s, p) => s + p.x, 0) / layerPts.length;
        const avgY = layerPts.reduce((s, p) => s + p.y, 0) / layerPts.length;
        return map.unproject([avgX, avgY]);
      }
      
      cx = cx / (6 * signedArea);
      cy = cy / (6 * signedArea);
      return map.unproject([cx, cy]);
    } catch (err) {
      console.warn('[MapWrapper] Centroid calculation failed, using first point', err);
      return { lat: points[0][0], lng: points[0][1] } as any;
    }
  }, []);

  /**
   * Add marker to map at specified coordinates
   */
  const addMarkerToMap = useCallback((
    map: maplibregl.Map,
    lat: number,
    lng: number,
    createdMarkers: maplibregl.Marker[]
  ): maplibregl.Marker | null => {
    try {
      const el = createCustomMarkerElement();
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' as any })
        .setLngLat([lng, lat])
        .addTo(map);
      createdMarkers.push(marker);
      return marker;
    } catch (e) {
      console.warn('[MapWrapper] Failed to add marker', e);
      return null;
    }
  }, [createCustomMarkerElement]);

  /**
   * Add polygon to map with fill and outline
   */
  const addPolygonToMap = useCallback((
    map: maplibregl.Map,
    points: [number, number][],
    addedSourceIds: string[],
    addedLayerIds: string[]
  ) => {
    const coords = points.map(p => [p[1], p[0]] as [number, number]);
    const ring = coords.slice();
    
    if (ring.length && (ring[0][0] !== ring.at(-1)?.[0] || ring[0][1] !== ring.at(-1)?.[1])) {
      ring.push(ring[0]);
    }
    
    const sourceId = 'polygon-source';
    const fillLayerId = 'polygon-fill';
    const lineLayerId = 'polygon-line';
    
    try {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [ring] }
        } as any
      });
      
      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': '#C84C0E', 'fill-opacity': 0.2 }
      });
      
      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceId,
        paint: { 'line-color': '#C84C0E', 'line-width': 2 }
      });
      
      addedSourceIds.push(sourceId);
      addedLayerIds.push(fillLayerId, lineLayerId);
      
      // Fit bounds
      const lats = points.map(p => p[0]);
      const lngs = points.map(p => p[1]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      try {
        map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 20 });
      } catch (e) {
        console.warn('[MapWrapper] Failed to fit bounds', e);
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to add polygon', e);
    }
  }, []);

  /**
   * Handle polygon display with centroid marker
   */
  const handlePolygonDisplay = useCallback((
    map: maplibregl.Map,
    points: [number, number][],
    addedSourceIds: string[],
    addedLayerIds: string[],
    createdMarkers: maplibregl.Marker[]
  ) => {
    addPolygonToMap(map, points, addedSourceIds, addedLayerIds);
    
    try {
      const centroid = calculateVisualCentroid(map, points);
      const marker = addMarkerToMap(map, centroid.lat, centroid.lng, createdMarkers);
      if (marker) {
        drawnLayersRef.current.push(marker as any);
      }
    } catch (e) {
      console.error('[MapWrapper] Failed to create centroid marker', e);
    }
  }, [addPolygonToMap, calculateVisualCentroid, addMarkerToMap]);

  /**
   * Handle single point display
   */
  const handleSinglePointDisplay = useCallback((
    map: maplibregl.Map,
    points: [number, number][],
    createdMarkers: maplibregl.Marker[]
  ) => {
    const marker = addMarkerToMap(map, points[0][0], points[0][1], createdMarkers);
    if (marker) {
      drawnLayersRef.current.push(marker as any);
    }
    
    try {
      map.setCenter([points[0][1], points[0][0]]);
      map.setZoom(15);
    } catch (e) {
      console.warn('[MapWrapper] Failed to set center/zoom', e);
    }
  }, [addMarkerToMap]);

  /**
   * Handle two points display
   */
  const handleTwoPointsDisplay = useCallback((
    map: maplibregl.Map,
    points: [number, number][],
    createdMarkers: maplibregl.Marker[]
  ) => {
    points.forEach(p => {
      const m = addMarkerToMap(map, p[0], p[1], createdMarkers);
      if (m) {
        drawnLayersRef.current.push(m as any);
      }
    });
    
    const lats = points.map(p => p[0]);
    const lngs = points.map(p => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    try {
      map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 20 });
    } catch (e) {
      console.warn('[MapWrapper] Failed to fit bounds', e);
    }
  }, [addMarkerToMap]);

  /**
   * Display features on map based on point count
   */
  const displayMapFeatures = useCallback((
    map: maplibregl.Map,
    points: [number, number][],
    defaultCenter: [number, number],
    addedSourceIds: string[],
    addedLayerIds: string[],
    createdMarkers: maplibregl.Marker[]
  ) => {
    if (points.length >= 3) {
      handlePolygonDisplay(map, points, addedSourceIds, addedLayerIds, createdMarkers);
    } else if (points.length === 1) {
      handleSinglePointDisplay(map, points, createdMarkers);
    } else if (points.length === 2) {
      handleTwoPointsDisplay(map, points, createdMarkers);
    } else {
      const marker = addMarkerToMap(map, defaultCenter[0], defaultCenter[1], createdMarkers);
      if (marker) {
        drawnLayersRef.current.push(marker as any);
      }
    }
  }, [handlePolygonDisplay, handleSinglePointDisplay, handleTwoPointsDisplay, addMarkerToMap]);

  /**
   * Disable map interactions
   */
  const disableMapInteractions = useCallback((map: maplibregl.Map) => {
    try { map.dragPan.disable(); } catch (e) { console.warn('[MapWrapper] Failed to disable dragPan', e); }
    try { map.scrollZoom.disable(); } catch (e) { console.warn('[MapWrapper] Failed to disable scrollZoom', e); }
    try { map.doubleClickZoom.disable(); } catch (e) { console.warn('[MapWrapper] Failed to disable doubleClickZoom', e); }
    
    try {
      const boxZoom = (map as any).boxZoom;
      if (boxZoom?.disable) {
        boxZoom.disable();
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to disable boxZoom', e);
    }
    
    try {
      const keyboard = (map as any).keyboard;
      if (keyboard?.disable) {
        keyboard.disable();
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to disable keyboard', e);
    }
  }, []);

  /**
   * Enable map interactions for location mode
   */
  const enableMapInteractions = useCallback((map: maplibregl.Map) => {
    try { map.dragPan.enable(); } catch (e) { console.warn('[MapWrapper] Failed to enable dragPan', e); }
    try { map.scrollZoom.enable(); } catch (e) { console.warn('[MapWrapper] Failed to enable scrollZoom', e); }
  }, []);

  /**
   * Configure map interactivity based on mode
   */
  const configureMapInteractivity = useCallback((map: maplibregl.Map) => {
    if (!interactive && !locationMode) {
      disableMapInteractions(map);
    }

    if (locationMode) {
      enableMapInteractions(map);
    }
  }, [interactive, locationMode, disableMapInteractions, enableMapInteractions]);

  /**
   * Setup location mode event handlers
   */
  const setupLocationMode = useCallback((map: maplibregl.Map): (() => void) | null => {
    if (!locationMode) return null;

    const locationHandler = () => {
      try {
        const c = map.getCenter();
        if (onLocationMove) {
          onLocationMove(c.lat, c.lng);
        }
      } catch (e) {
        console.warn('[MapWrapper] Failed to read map center', e);
      }
    };

    map.on('move', locationHandler);
    map.on('moveend', locationHandler);
    map.on('drag', locationHandler);

    if (!initialLocationSentRef.current) {
      initialLocationSentRef.current = true;
      locationHandler();
    }

    return () => {
      map.off('move', locationHandler);
      map.off('moveend', locationHandler);
      map.off('drag', locationHandler);
    };
  }, [locationMode, onLocationMove]);

  /**
   * Clean up map markers and layers
   */
  const cleanupMapLayers = useCallback((
    map: maplibregl.Map,
    createdMarkers: maplibregl.Marker[],
    addedLayerIds: string[],
    addedSourceIds: string[]
  ) => {
    createdMarkers.forEach(m => {
      try {
        m.remove();
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove marker', e);
      }
    });
    createdMarkers.length = 0;

    addedLayerIds.forEach(id => {
      try {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove layer', e);
      }
    });

    addedSourceIds.forEach(id => {
      try {
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove source', e);
      }
    });

    addedLayerIds.length = 0;
    addedSourceIds.length = 0;
  }, []);

  /**
   * Main map initialization and update effect
   * Handles map creation, marker placement, and event listeners
   */
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    const points = parseCoordinates();
    const defaultCenterLatLng = getInitialCenter(points);
    const centerLngLat: [number, number] = [defaultCenterLatLng[1], defaultCenterLatLng[0]];

    // Initialize MapLibre map
    const styleUrl = 'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc';
    const map = new maplibregl.Map({
      container: container,
      style: styleUrl,
      center: centerLngLat,
      zoom: 15,
      attributionControl: false,
    });

    mapInstanceRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), 'bottom-left');

    const addedSourceIds: string[] = [];
    const addedLayerIds: string[] = [];
    const createdMarkers: maplibregl.Marker[] = [];

    // When map is loaded, add initial features
    map.on('load', () => {
      if (!locationMode) {
        displayMapFeatures(map, points, defaultCenterLatLng, addedSourceIds, addedLayerIds, createdMarkers);
      }
    });

    configureMapInteractivity(map);
    const cleanupLocationMode = setupLocationMode(map);

    setTimeout(() => {
      try {
        map.resize();
      } catch (e) {
        console.warn('[MapWrapper] Failed to resize map', e);
      }
    }, 200);

    return () => {
      if (cleanupLocationMode) {
        cleanupLocationMode();
      }
      initialLocationSentRef.current = false;
      try {
        cleanupMapLayers(map, createdMarkers, addedLayerIds, addedSourceIds);
      } catch (e) {
        console.warn('[MapWrapper] Failed to cleanup map layers', e);
      }
      try {
        map.remove();
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove map', e);
      }
      mapInstanceRef.current = null;
    };
  }, [
    interactive,
    coordinates,
    locationMode,
    initialCenter,
    onLocationMove,
    parseCoordinates,
    getInitialCenter,
    displayMapFeatures,
    configureMapInteractivity,
    setupLocationMode,
    cleanupMapLayers
  ]);

  /**
   * Expose polygon drawing controls to parent component via ref
   */
  useEffect(() => {
    if (!externalControlRef) return;

    externalControlRef.current = {
      start: () => startDrawingOnMap(),
      finish: () => finishDrawingOnMap(),
      clear: (notify?: boolean) => clearDrawingsOnMap(notify),
      undo: () => undoDrawingOnMap()
    };

    return () => { 
      if (externalControlRef) externalControlRef.current = null; 
    };
  }, [externalControlRef]);

  /**
   * Start polygon drawing mode
   * - Clears previous drawings
   * - Changes cursor to crosshair
   * - Attaches click handler for point placement
   */
  const startDrawingOnMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    drawingPointsRef.current = [];

    // Remove preview layers
    const previewLayers = ['preview-line', 'preview-fill'];
    previewLayers.forEach(layerId => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        console.warn(`[MapWrapper] Failed to remove layer ${layerId}`, e);
      }
    });

    try {
      if (map.getSource('preview')) {
        map.removeSource('preview');
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to remove preview source', e);
    }

    tempMarkersRef.current.forEach(m => {
      try {
        (m as any).remove();
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove temp marker', e);
      }
    });
    tempMarkersRef.current = [];

    const container = map.getContainer();
    if (container) {
      container.style.cursor = 'crosshair';
    }
    map.getCanvas().style.cursor = 'crosshair';
    map.on('click', onMapClick);
  };

  /**
   * Update preview geometry based on current drawing points
   */
  const updatePreviewGeometry = (map: maplibregl.Map) => {
    try {
      const coords = drawingPointsRef.current.map(p => [p[1], p[0]]);
      const preview = {
        type: 'Feature',
        geometry: drawingPointsRef.current.length >= 3
          ? { type: 'Polygon', coordinates: [[...coords, coords[0]]] }
          : { type: 'LineString', coordinates: coords }
      } as any;

      const previewSource = map.getSource('preview');
      
      if (previewSource) {
        const geoJsonSource = previewSource as maplibregl.GeoJSONSource;
        geoJsonSource.setData(preview);
      } else {
        map.addSource('preview', { type: 'geojson', data: preview });
        map.addLayer({
          id: 'preview-fill',
          type: 'fill',
          source: 'preview',
          paint: { 'fill-color': '#C84C0E', 'fill-opacity': 0.15 }
        });
        map.addLayer({
          id: 'preview-line',
          type: 'line',
          source: 'preview',
          paint: { 'line-color': '#C84C0E', 'line-width': 2 }
        });
      }
    } catch (err) {
      console.warn('[MapWrapper] Failed to update preview geometry', err);
    }
  };

  /**
   * Handle map clicks during drawing mode
   * - Adds point to drawing array
   * - Shows temporary marker at click location
   * - Updates temporary polyline/polygon visualization
   */
  const onMapClick = (e: any) => {
    const latlng: [number, number] = [e.lngLat.lat, e.lngLat.lng];
    drawingPointsRef.current.push(latlng);

    const map = mapInstanceRef.current;
    if (!map) return;

    // Add small DOM marker at click location
    try {
      const el = document.createElement('div');
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.background = '#C84C0E';
      el.style.borderRadius = '50%';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.pointerEvents = 'none';
      
      const m = new maplibregl.Marker({ element: el })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);
      tempMarkersRef.current.push(m as any);
    } catch (err) {
      console.warn('[MapWrapper] Failed to add temp marker', err);
    }

    updatePreviewGeometry(map);
  };

  /**
   * Remove preview layers and source from map
   */
  const removePreviewLayers = (map: maplibregl.Map) => {
    const previewLayers = ['preview-line', 'preview-fill'];
    previewLayers.forEach(layerId => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        console.warn(`[MapWrapper] Failed to remove ${layerId}`, e);
      }
    });

    try {
      if (map.getSource('preview')) {
        map.removeSource('preview');
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to remove preview source', e);
    }
  };

  /**
   * Remove all temporary markers
   */
  const removeTempMarkers = () => {
    tempMarkersRef.current.forEach(m => {
      try {
        (m as any).remove();
      } catch (e) {
        console.warn('[MapWrapper] Failed to remove temp marker', e);
      }
    });
    tempMarkersRef.current = [];
  };

  /**
   * Add final drawn polygon to map
   */
  const addDrawnPolygon = (map: maplibregl.Map, points: [number, number][]) => {
    const coords = points.map(p => [p[1], p[0]]);
    const ring = coords.slice();
    
    if (ring.length && (ring[0][0] !== ring.at(-1)?.[0] || ring[0][1] !== ring.at(-1)?.[1])) {
      ring.push(ring[0]);
    }

    // Remove existing drawn layers
    const drawnLayers = ['drawn-fill', 'drawn-line'];
    drawnLayers.forEach(layerId => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        console.warn(`[MapWrapper] Failed to remove ${layerId}`, e);
      }
    });

    try {
      if (map.getSource('drawn')) {
        map.removeSource('drawn');
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to remove drawn source', e);
    }

    // Add new drawn polygon
    try {
      map.addSource('drawn', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [ring] }
        } as any
      });
      
      map.addLayer({
        id: 'drawn-fill',
        type: 'fill',
        source: 'drawn',
        paint: { 'fill-color': '#C84C0E', 'fill-opacity': 0.15 }
      });
      
      map.addLayer({
        id: 'drawn-line',
        type: 'line',
        source: 'drawn',
        paint: { 'line-color': '#C84C0E', 'line-width': 2 }
      });

      drawnLayersRef.current.push('drawn' as any);
    } catch (e) {
      console.warn('[MapWrapper] Failed to add drawn polygon', e);
    }
  };

  /**
   * Finish polygon drawing
   * - Removes click handler
   * - Resets cursor
   * - Creates final polygon if 3+ points
   * - Calls completion callback
   * - Cleans up temporary markers
   */
  const finishDrawingOnMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.off('click', onMapClick);
    
    const container = map.getContainer();
    if (container) {
      container.style.cursor = '';
    }
    map.getCanvas().style.cursor = '';

    const pts = drawingPointsRef.current.slice();
    
    if (pts.length >= 3) {
      addDrawnPolygon(map, pts);

      try {
        if (onPolygonComplete) {
          onPolygonComplete(pts.map(p => ({ lat: p[0], lng: p[1] })));
        }
      } catch (e) {
        console.error('[MapWrapper] Failed to call onPolygonComplete', e);
      }
    }

    removePreviewLayers(map);
    removeTempMarkers();
    drawingPointsRef.current = [];
  };

  /**
   * Undo last drawn point
   * - Removes last point from array
   * - Removes corresponding marker
   * - Redraws temporary visualization
   */
  const undoDrawingOnMap = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove last temp marker
    try {
      const last = tempMarkersRef.current.pop();
      if (last) {
        try {
          (last as any).remove();
        } catch (e) {
          console.warn('[MapWrapper] Failed to remove last marker', e);
        }
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to pop marker', e);
    }

    drawingPointsRef.current.pop();

    updatePreviewGeometry(map);
  };

  /**
   * Clear all drawings (both temporary and final)
   * @param notify - If true, calls onPolygonComplete with empty array
   */
  const clearDrawingsOnMap = (notify: boolean = false) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove drawn layers
    const drawnLayers = ['drawn-fill', 'drawn-line'];
    drawnLayers.forEach(layerId => {
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        console.warn(`[MapWrapper] Failed to remove ${layerId}`, e);
      }
    });

    try {
      if (map.getSource('drawn')) {
        map.removeSource('drawn');
      }
    } catch (e) {
      console.warn('[MapWrapper] Failed to remove drawn source', e);
    }

    removePreviewLayers(map);
    removeTempMarkers();
    drawingPointsRef.current = [];

    // Notify parent if requested
    if (notify && onPolygonComplete) {
      onPolygonComplete([]);
    }
  };

  return <Box ref={mapRef} sx={mapDivStyle} />;
}

/**
 * MapComponent Props Interface
 */
interface MapComponentProps {
  readonly application: Property | null;
  readonly applicationStatus: string;  // Property data containing GIS information
  readonly applicationID: string;
}

/**
 * MapComponent - Parent Container
 * 
 * Main component that manages map state and user interactions
 * 
 * Features:
 * - Toggle between view/edit modes
 * - Polygon drawing with undo/clear controls
 * - Single point location editing with live preview
 * - Automatic coordinate persistence via RTK Query mutation
 * - Display of current coordinates and centroid
 * 
 * State Management:
 * - Uses local React state for UI interactions
 * - Persists changes to backend via RTK Query mutation
 * - RTK Query cache automatically updates on successful mutation
 */
export default function MapComponent({ application, applicationStatus, applicationID }: MapComponentProps) {
  // Extract coordinates from application data
  const coordinates = application?.GISData?.Coordinates;
  const status = applicationStatus;
  

  // UI state
  const [interactive, setInteractive] = useState(false);  // Map interactivity toggle
  const [polygonActive, setPolygonActive] = useState(false);  // Polygon drawing mode active
  const [locationMode, setLocationMode] = useState(false);  // Single point editing mode

  // Location state
  const [locationCenter, setLocationCenter] = useState<{ lat: number; lng: number } | null>(null);  // Live map center during editing
  const [initialEditCenter, setInitialEditCenter] = useState<{ lat: number; lng: number } | null>(null);  // Initial center when entering edit mode
  const [currentPolygon, setCurrentPolygon] = useState<Array<{ lat: number; lng: number }> | null>(null);  // Currently drawn polygon
  const [lastSavedLocation, setLastSavedLocation] = useState<{ lat: number; lng: number } | null>(null);  // Last saved single point
   const [postApplicationLog] = usePostApplicationLogMutation();
    const { user } = useAuth();
    const userName= user?.username
  // Refs
  const polygonControlRef = useRef<PolygonControlRef>(null);  // Control polygon drawing from parent

  // RTK Query mutation for persisting coordinates to backend
  const [replaceGisCoordinates] = useReplaceGisCoordinatesMutation();

  /**
   * Sync coordinates from props to local state
   * Extracts single point coordinates when available
   */
  useEffect(() => {
    // Reset drawing state when coordinates change
    setCurrentPolygon(null);
    setLocationCenter(null);

    // Extract single point coordinate from various possible structures
    const fromCoordinates = (() => {
      if (Array.isArray(coordinates) && coordinates.length === 1) {
        return {
          lat: coordinates[0].Latitude ?? coordinates[0].Latitude ?? 0,
          lng: coordinates[0].Longitude ?? coordinates[0].Longitude ?? 0,
        };
      }

      // Check GISData for single point
      const gs = application?.GISData;
      const lat = gs?.Latitude ?? gs?.Latitude;
      const lng = gs?.Longitude ?? gs?.Longitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        return { lat, lng };
      }

      return null;
    })();

    // Update lastSavedLocation if coordinate changed
    if (
      fromCoordinates &&
      (!lastSavedLocation ||
        fromCoordinates.lat !== lastSavedLocation.lat ||
        fromCoordinates.lng !== lastSavedLocation.lng)
    ) {
      setLastSavedLocation(fromCoordinates);
    }
  }, [coordinates, application, lastSavedLocation]);

  /**
   * Convert backend coordinate format to polygon points
   * Handles both uppercase and lowercase property names
   */
  const backendCoordsToPolygon = (coords: any) =>
    Array.isArray(coords)
      ? coords.map((c) => ({
          lat: c.Latitude ?? c.latitude ?? 0,
          lng: c.Longitude ?? c.longitude ?? 0,
        }))
      : [];

  /**
   * Live update handler for location mode
   * Called continuously as user pans the map
   */
  const handleLocationMove = useCallback((lat: number, lng: number) => {
    setLocationCenter({ lat, lng });
  }, []);

  /**
   * Handle polygon drawing completion
   * - Updates local state immediately
   * - Persists to backend via RTK Query mutation
   * - Reverts on error
   */
  const handlePolygonComplete = async (polygonArr: Array<{ lat: number; lng: number }>) => {
    setCurrentPolygon(polygonArr);
    setLastSavedLocation(null);

    const updatedCoords = polygonArr.map((p) => ({ latitude: p.lat, longitude: p.lng }));

    const gisDataId = application?.GISData?.ID ?? application?.GISData?.ID ?? null;
    const applicationId = application?.ID ?? null;
    
    // Log polygon change
    const prevCoords = Array.isArray(application?.GISData?.Coordinates) ? application.GISData.Coordinates : [];
    let comments = '';
    if (prevCoords.length > 0) {
      comments = `Polygon changed`;
    } else {
      comments = `Polygon added`;
    }

    if (gisDataId && applicationId) {
      try {
        await replaceGisCoordinates({ 
          gisDataId, 
          applicationId,
          points: updatedCoords 
        }).unwrap();
      } catch (err) {
        console.error('Failed to save polygon coordinates', err);
        setCurrentPolygon(null);
      }
    } else {
      console.warn('Missing GISDataID or ApplicationID; cannot persist coordinates');
    }

    // Build log payload
    const logPayload = {
      applicationId: applicationID || '',
      propertyId: application?.GISData?.PropertyID || '',
      gisDataId: gisDataId || '',
      action: "EDIT_POLYGON",
      performedBy: userName !== undefined && userName ? userName : "SERVICE_MANAGER",
      actor: "SERVICE MANAGER",
      comments,
      timestamp: new Date().toISOString(),
      metadata: {}
    };

    // Post the log
    try {
      if (typeof postApplicationLog === 'function') {
        await postApplicationLog(logPayload).unwrap();
      }
    } catch (err) {
      console.error("Failed to post polygon application log:", err);
    }
  };

  /**
   * Save single point location
   * - Uses live center from locationCenter state
   * - Updates local state immediately for instant feedback
   * - Persists to backend
   * - Exits location mode on success
   */
  const saveLocation = async () => {
    if (!locationCenter) return;

    const payload = [{ latitude: locationCenter.lat, longitude: locationCenter.lng }];

    // Log changed coordinates before editing
    const prevLocation = lastSavedLocation;
    if (prevLocation && (prevLocation.lat !== locationCenter.lat || prevLocation.lng !== locationCenter.lng)) {
      console.log(`Location changed from lat: ${prevLocation.lat}, lng: ${prevLocation.lng} to lat: ${locationCenter.lat}, lng: ${locationCenter.lng}`);
    }

    setLastSavedLocation(locationCenter);
    setCurrentPolygon(null);
    setLocationMode(false);
    setInitialEditCenter(null);

    const gisDataId = application?.GISData?.ID ?? null;
    const applicationId = application?.ID ?? null;

    if (gisDataId && applicationId) {
      try {
        await replaceGisCoordinates({ 
          gisDataId, 
         applicationId,
          points: payload 
        }).unwrap();
        console.log('Location saved successfully');
      } catch (err) {
        console.error('Failed to save location', err);
        setLastSavedLocation(null);
      }
    } else {
      console.warn('Missing GISDataID or ApplicationID; cannot persist location');
    }

    // Prepare log entry in required format
    let comments = '';
    if (prevLocation && (prevLocation.lat !== locationCenter.lat || prevLocation.lng !== locationCenter.lng)) {
      comments = `Location changed`;
    } else {
      comments = `Location added`;
    }
    // Build log payload
    const logPayload = {
      applicationId: applicationID || '',
      propertyId: application?.GISData?.PropertyID || '',
      gisDataId: gisDataId || '',
      action: "EDIT_LOCATION",
      performedBy: userName !== undefined && userName ? userName : "SERVICE_MANAGER",
      actor: "SERVICE MANAGER",
      comments,
      timestamp: new Date().toISOString(),
      metadata: {}
    };
    console.log("Location Log Payload : ", logPayload);

    // Post the log
    try {
      if (typeof postApplicationLog === 'function') {
        await postApplicationLog(logPayload).unwrap();
      }
    } catch (err) {
      console.error("Failed to post location application log:", err);
    }
  };

  /**
   * Cancel location editing mode
   * Discards any unsaved changes
   */
  const cancelLocation = () => {
    setLocationMode(false);
    setLocationCenter(null);
    setInitialEditCenter(null);
  };

  /**
   * Memoized coordinates for map display
   * Priority: currentPolygon > backend coordinates > lastSavedLocation
   * Returns null in location mode (no markers displayed)
   */
  const displayCoords = React.useMemo(() => {
    if (locationMode) return null;  // Hide markers in location edit mode
    
    if (currentPolygon?.length) {
      return currentPolygon.map((p) => ({ Latitude: p.lat, Longitude: p.lng }));
    }
    
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      return coordinates;
    }
    
    if (lastSavedLocation) {
      return [{ Latitude: lastSavedLocation.lat, Longitude: lastSavedLocation.lng }];
    }
    
    return null;
  }, [locationMode, currentPolygon, lastSavedLocation, coordinates]);

  /**
   * Calculate centroid for display in info panel
   * - For single point: returns the point
   * - For polygon: calculates geometric centroid using shoelace formula
   */
  const displayCentroid = (() => {
    const sourceCoords = locationMode && locationCenter
      ? [{ Latitude: locationCenter.lat, Longitude: locationCenter.lng }]
      : displayCoords || [];
    
    const points = backendCoordsToPolygon(sourceCoords);
    if (!points.length) return null;
    if (points.length === 1) return points[0];

    // Calculate polygon centroid using shoelace formula
    let signedArea = 0, cx = 0, cy = 0;
    for (let i = 0; i < points.length; i++) {
      const { lat: x0, lng: y0 } = points[i];
      const { lat: x1, lng: y1 } = points[(i + 1) % points.length];
      const a = x0 * y1 - x1 * y0;
      signedArea += a;
      cx += (x0 + x1) * a;
      cy += (y0 + y1) * a;
    }
    signedArea *= 0.5;

    // Fallback for degenerate polygons
    if (signedArea === 0) return points[0];

    cx = cx / (6 * signedArea);
    cy = cy / (6 * signedArea);
    return { lat: cx, lng: cy };
  })();

  return (
    <Box sx={mapComponentOuterStyle}>
      {/* Map Container */}
      <Box sx={mapWrapperContainerStyle}>
        <MapWrapper
          interactive={interactive}
          coordinates={displayCoords}
          externalControlRef={polygonControlRef}
          onPolygonComplete={handlePolygonComplete}
          locationMode={locationMode}
          initialCenter={initialEditCenter}
          onLocationMove={handleLocationMove}
        />

        {/* Overlay to enable interactivity on click (for non-interactive maps) */}
        {!interactive && (
          <Box
            sx={mapOverlayStyle}
            onClick={() => setInteractive(true)}
            title="Click to activate map"
          />
        )}

        {/* Polygon Drawing Controls (visible when polygon mode active) */}
        {polygonActive && (
          <Box sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 12, 
            display: 'flex', 
            gap: 1, 
            zIndex: 1200 
          }}>
            {/* Clear button */}
            <IconButton
              aria-label="clear"
              onClick={() => polygonControlRef.current?.clear?.(false)}
              sx={mapIconButtonStyle}
            >
              <img src={closeSvg} alt="close" style={{ width: 24, height: 24 }} />
            </IconButton>

            {/* Start drawing button */}
            <Button
              variant="contained"
              size="small"
              sx={mapButtonStyle}
              onClick={() => polygonControlRef.current?.start?.()}
            >
              Start
            </Button>

            {/* Finish drawing button */}
            <Button
              variant="contained"
              size="small"
              sx={mapButtonStyle}
              onClick={() => { 
                polygonControlRef.current?.finish?.(); 
                setPolygonActive(false); 
              }}
            >
              Finish
            </Button>

            {/* Undo last point button */}
            <IconButton
              aria-label="undo"
              onClick={() => polygonControlRef.current?.undo?.()}
              sx={mapUndoButtonStyle}
            >
              <img src={undoSvg} alt="undo" style={{ width: 28, height: 28, paddingTop: 2 }} />
            </IconButton>
          </Box>
        )}

        {/* Coordinate Info Panel (top right) - shown when NOT in location mode */}
        {displayCentroid && !locationMode && (
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            background: '#fff', 
            p: 1, 
            borderRadius: 1, 
            zIndex: 1199 
          }}>
            <div style={{ fontSize: 12, color: '#333' }}>
              latitude: {displayCentroid.lat.toFixed(6)}
            </div>
            <div style={{ fontSize: 12, color: '#333' }}>
              longitude: {displayCentroid.lng.toFixed(6)}
            </div>
            {displayCoords && displayCoords.length > 2 && (
              <div style={{ fontSize: 12, color: '#333', marginTop: 6 }}>
                points: {displayCoords.length}
              </div>
            )}
          </Box>
        )}
      </Box>

      {/* Main Action Buttons */}
      <Box sx={mapButtonPanelStyle}>
        {/* Edit Location Button - for single point editing */}
        <Button
          variant="contained"
          sx={mapButtonStyle}
          onClick={() => {
            setPolygonActive(false);
            polygonControlRef.current?.clear?.(false);

            // Calculate initial center for location edit mode
            // Priority: single saved point > polygon centroid > default
            const polygonCoords = currentPolygon?.length ? currentPolygon : null;
            const backendCoords = Array.isArray(displayCoords) ? backendCoordsToPolygon(displayCoords) : [];
            const coordsForCenter = polygonCoords || backendCoords;

            let initial: { lat: number; lng: number } | null = null;

            if (coordsForCenter?.length === 1) {
              // Single point: use directly
              initial = { lat: coordsForCenter[0].lat, lng: coordsForCenter[0].lng };
            } else if (coordsForCenter?.length) {
              // Multiple points: calculate average as initial center
              const avg = coordsForCenter.reduce(
                (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), 
                { lat: 0, lng: 0 }
              );
              initial = { 
                lat: avg.lat / coordsForCenter.length, 
                lng: avg.lng / coordsForCenter.length 
              };
            }

            setInitialEditCenter(initial);
            setLocationMode(true);
            setInteractive(true);
          }}
          startIcon={
            <Box 
              component="img" 
              src={editSquareSvg} 
              alt="edit" 
              sx={{ width: 18, height: 18, ml: 0.5 }} 
            />
          }
          disabled={status === "AUDIT_VERIFIED"}
        >
          Edit Location
        </Button>

        {/* Edit Polygon Button - toggle polygon drawing mode */}
        <Button
          variant="contained"
          sx={mapButtonStyle}
          onClick={() => {
            setPolygonActive((prev) => {
              const next = !prev;
              if (next) {
                // Entering polygon mode: exit location mode
                setLocationMode(false);
                setInteractive(true);
              }
              return next;
            });
          }}
          startIcon={
            <Box 
              component="img" 
              src={editSquareSvg} 
              alt="edit" 
              sx={{ width: 18, height: 18 }} 
            />
          }
          disabled={status === "AUDIT_VERIFIED"}
        >
          Edit Polygon
        </Button>
      </Box>

      {/* Location Mode Overlay (center marker + coordinate display) */}
      {locationMode && (
        <>
          {/* Centered marker that stays in middle of screen */}
          <Box sx={{ 
            position: 'absolute', 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -100%)',  // Position point of marker at center
            pointerEvents: 'none',  // Don't block map interactions
            zIndex: 1300 
          }}>
            <img 
              src={propertyMarkerSvg} 
              alt="center" 
              style={{ width: 34, height: 34 }} 
            />
          </Box>

          {/* Live coordinate display with save/cancel buttons */}
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12, 
            background: '#fff', 
            p: 1, 
            borderRadius: 1, 
            zIndex: 1301 
          }}>
            <div style={{ fontSize: 12 }}>
              Lat: {locationCenter ? locationCenter.lat.toFixed(6) : '—'}
            </div>
            <div style={{ fontSize: 12 }}>
              Lng: {locationCenter ? locationCenter.lng.toFixed(6) : '—'}
            </div>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button 
                size="small" 
                variant="contained" 
                sx={mapButtonStyle} 
                onClick={saveLocation}
              >
                Save
              </Button>
              <Button 
                size="small" 
                variant="text" 
                sx={mapButtonStyle} 
                onClick={cancelLocation}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
