// MapView.tsx displays a Leaflet map with property markers for the Citizen property list/map view.
// It supports selection, custom marker icons, and property details popups.
// Main responsibilities:
// - Render map with property markers and selection
// - Show property info card on marker select
// - Handle marker click and details navigation
// - Use custom icons and panes for selected marker
// Props:
//   properties: array of property objects
//   selectedMarkerIdx: index of selected marker
//   setSelectedMarkerIdx: callback to set selected marker
//   center, height, showEmptyMessage, zoom, onViewDetails: map options and event handlers
import React, { useMemo, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import '../../../../styles/Citizen/PropertyMarker.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useNavigate } from 'react-router-dom';

import pointerLight from '../../../assets/Citizen/home_page/property_pointer_light.svg';
import pointerDark from '../../../assets/Citizen/home_page/property_pointer_dark.svg';

// Accept the *application* shape where GISData.Coordinates is under Property
// ...existing code...

interface GenericProperty {
  Property?: {
    GISData?: {
      Latitude?: number;
      Longitude?: number;
      Coordinates?: { Latitude?: number; Longitude?: number }[];
    };
    Address?: {
      BlockNo?: string;
      PinCode?: string | number;
      Display?: string;
      Street?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  locationData?: {
    address?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  PropertyID?: string;
  id?: string;
  Status?: string;
  enumerationProgress?: number;
  [key: string]: any;
}

// MapViewProps defines the props for the MapView component
interface MapViewProps {
  properties: GenericProperty[];
  selectedMarkerIdx: number | null;
  setSelectedMarkerIdx: (idx: number | null) => void;
  center?: [number, number];
  height?: number;
  showEmptyMessage?: boolean;
  zoom?: number;
  onViewDetails?: (property: GenericProperty) => void;
}

const FALLBACK_CENTER: [number, number] = [12.9716, 77.5946];

const STATUS_PROGRESS_MAP: Record<string, number> = {
  INITIATED: 20,
  ASSIGNED: 40,
  VERIFIED: 60,
  AUDIT_VERIFIED: 80,
  APPROVED: 100,
};

// propertyToMarkerInfo: extracts marker info from property object
function propertyToMarkerInfo(p: GenericProperty): {
  lat?: number;
  lng?: number;
  address?: any;
  blockNo?: string;
  pinCode?: string | number;
  id?: string;
  Status?: string;
  enumerationProgress?: number;
} {
  const status = (p.Status || '').toUpperCase();
  const enumerationProgress = STATUS_PROGRESS_MAP[status] ?? 0;

  if (p?.locationData?.coordinates) {
    return {
      lat: p.Property?.GISData?.Latitude,
      lng: p.Property?.GISData?.Longitude,
      address: p.locationData.address,
      blockNo: p?.Property?.Address?.BlockNo,
      pinCode: p?.Property?.Address?.PinCode,
      id: p.id,
      enumerationProgress,
    };
  }

  // Check if GISData has direct Latitude/Longitude
  const gisData = p?.Property?.GISData;
  let lat: number | undefined;
  let lng: number | undefined;

  if (gisData) {
    // First try direct Latitude/Longitude
    if (gisData.Latitude != null && gisData.Longitude != null) {
      lat = gisData.Latitude;
      lng = gisData.Longitude;
    }
    // Fallback to Coordinates array
    else if (gisData.Coordinates?.[0]) {
      lat = gisData.Coordinates[0].Latitude;
      lng = gisData.Coordinates[0].Longitude;
    }
  }

  const addressObj = p?.Property?.Address;
  let addressString = '';

  if (addressObj) {
    // Use Display if available, otherwise construct from parts
    if (addressObj.Display) {
      addressString = addressObj.Display;
    } else if (addressObj.Street || addressObj.Locality) {
      const parts = [
        addressObj.Street,
        addressObj.Locality,
        addressObj.BlockNo,
        addressObj.WardNo,
      ].filter(Boolean);
      addressString = parts.join(', ');
    } else {
      addressString = 'Address not available';
    }
  } else {
    addressString = p?.PropertyID || 'Unknown address';
  }

  return {
    lat,
    lng,
    address: addressString,
    blockNo: p?.Property?.Address?.BlockNo,
    pinCode: p?.Property?.Address?.PinCode,
    id: p.id || p.PropertyID,
    enumerationProgress,
  };
}

// createMarkerElement: builds a DOM element for MapLibre marker (keeps same HTML/style as Leaflet DivIcon)
function createMarkerElement(
  selected: boolean,
  markerData?: ReturnType<typeof propertyToMarkerInfo>
): HTMLElement {
  const pointerSize = selected ? 70 : 60;
  const blockNoStr = markerData?.blockNo
    ? `<div class="marker-card-info"><b>Block No:</b> ${markerData.blockNo}</div>`
    : '';
  const pinCodeStr = markerData?.pinCode
    ? `<div class="marker-card-info"><b>Pincode:</b> ${markerData.pinCode}</div>`
    : '';

  const cardHtml =
    selected && markerData
      ? `
        <div class="marker-card">
          <div class="marker-card-inner">
            <div class="marker-card-title">${
              markerData.address ?? 'Unknown address'
            }</div>
            ${blockNoStr}
            ${pinCodeStr}
            <div class="marker-card-row">
              <div class="marker-card-progress">
                ${markerData.enumerationProgress ?? 0}% Enumeration process complete
              </div>
              <!--
              <div class="marker-card-actions">
                <button class="marker-card-btn-2" data-prop-id="${
                  markerData.id ?? ''
                }" tabIndex="0">
                  View Details
                </button>
              </div>
              -->
            </div>
          </div>
        </div>
        `
      : '';

  const wrapper = document.createElement('div');
  wrapper.className = `property-marker${selected ? ' selected' : ''}`;
  wrapper.innerHTML = `
    <img src="${selected ? pointerDark : pointerLight}"
         alt="property marker"
         style="width:${pointerSize}px;height:${pointerSize}px;display:block;" />
    ${cardHtml}
  `;

  // set basic sizing so MapLibre marker placement matches previous behavior
  wrapper.style.width = `${pointerSize}px`;
  wrapper.style.height = `${pointerSize + (selected ? 130 : 0)}px`;
  wrapper.style.display = 'block';
  wrapper.style.cursor = 'pointer';
  return wrapper;
}

// NOTE: Leaflet-specific pane logic removed — MapLibre markers use element zIndex instead.

// MapView component: renders MapLibre map with property markers and selection logic
const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedMarkerIdx,
  setSelectedMarkerIdx,
  center,
  height = 400,
  showEmptyMessage = true,
  zoom = 15,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markersData = useMemo(() => {
    return properties
      .map((p, idx) => ({
        ...propertyToMarkerInfo(p),
        idx,
        original: p,
      }))
      .filter((m) => m.lat != null && m.lng != null);
  }, [properties]);

  // computed center in [lng, lat] for MapLibre
  const computedCenterLngLat: [number, number] =
    markersData.length > 0
      ? [
          markersData[0].lng ?? FALLBACK_CENTER[1],
          markersData[0].lat ?? FALLBACK_CENTER[0],
        ]
      : center
      ? [center[1], center[0]]
      : [FALLBACK_CENTER[1], FALLBACK_CENTER[0]];

  // init map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // cleanup existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const styleUrl =
      'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc';

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: computedCenterLngLat,
      zoom,
      attributionControl: false,
      pitch: 0,
      bearing: 0,
      dragRotate: true,
      pitchWithRotate: true,
      touchPitch: true,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // prevent default context menu so right-click drag works (keeps parity with previous behavior)
    const handleContextMenu = (e: Event) => e.preventDefault();
    mapContainerRef.current.addEventListener('contextmenu', handleContextMenu);

    // cleanup on unmount
    return () => {
      if (mapRef.current) {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initialize once

  // update markers when data or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (markersData.length === 0) {
      // add a center default marker similar to previous logic
      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.background = '#1976d2';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(computedCenterLngLat)
        .addTo(map);
      markersRef.current.push(marker);
      return;
    }

    const bounds = new maplibregl.LngLatBounds();

    markersData.forEach((m, idx) => {
      const isSelected = selectedMarkerIdx === idx;
      const el = createMarkerElement(isSelected, isSelected ? m : undefined);

      // set zIndex for selected marker so its card appears above others
      if (isSelected) {
        el.style.zIndex = '750';
      } else {
        el.style.zIndex = '500';
      }

      // ensure clicks inside marker elements are visible to listeners
      el.style.pointerEvents = 'auto';

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([m.lng!, m.lat!])
        .addTo(map);

      // click handler to toggle selection (preserve original behavior)
      const onMarkerClick = (e: MouseEvent) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        // if the click was on the view-details button, let document handler handle it
        if (target.closest && target.closest('.marker-card-btn-2')) return;
        setSelectedMarkerIdx(selectedMarkerIdx === idx ? null : idx);
      };
      el.addEventListener('click', onMarkerClick);

      markersRef.current.push(marker);
      bounds.extend([m.lng!, m.lat!]);
    });

    // NOTE: fitBounds moved to a separate effect that runs only when markersData changes,
    // so selecting a marker (selectedMarkerIdx change) won't trigger a re-fit/zoom out.
  }, [markersData, selectedMarkerIdx, setSelectedMarkerIdx]);

  // Fit map to show all markers only when markersData changes (not on selection changes)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || markersData.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    markersData.forEach((m) => bounds.extend([m.lng!, m.lat!]));
    // if only one marker, center on it instead of fitting bounds to avoid weird zoom
    if (markersData.length === 1) {
      map.easeTo({ center: [markersData[0].lng!, markersData[0].lat!], zoom });
    } else {
      map.fitBounds(bounds, { padding: 50, maxZoom: 18, duration: 500 });
    }
  }, [markersData, zoom]);

  // Handle "View Details" button click (same document-level listener as before)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const btn = target.closest
        ? (target.closest('.marker-card-btn-2') as HTMLElement | null)
        : null;
      if (!btn) return;
      const idAttr = btn.getAttribute('data-prop-id');
      const markerData = markersData.find((m) => String(m.id) === String(idAttr));

      if (markerData) {
        // if (onViewDetails) {
        //   onViewDetails(markerData.original);
        // } else {
        //   navigate(`/citizen/properties/${markerData.id}`, {
        //     state: {
        //       applicationId: markerData.id,
        //     },
        //   });
        // }
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [markersData, navigate, onViewDetails]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        zIndex: 10,
        borderRadius: '17px',
      }}
      className="property-map-root"
      data-testid="property-map-root"
    >
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
        data-testid="maplibre-container"
      />
      {markersData.length === 0 && showEmptyMessage && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(255,255,255,0.93)',
            px: 2.6,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>
            No properties yet. Start by adding one.
          </span>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
