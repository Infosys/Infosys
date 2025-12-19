// MapComponent.tsx displays a Leaflet map centered on a given latitude/longitude with a marker.
// It uses react-leaflet for map rendering and supports custom tile URL and marker icon.
// Main responsibilities:
// - Render a map centered at lat/lng
// - Show a marker at the property location
// - Use custom tile URL and icon for map/marker
// Props:
//   latLng: { lat, lng } - coordinates to center and mark
//   tileUrl: string - URL for map tiles
//   customIcon: L.Icon - Leaflet icon for marker
import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type LatLng = { lat: number; lng: number };
type CustomIconLike = {
  iconUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  className?: string;
};

const MapComponent: FC<{
  latLng: LatLng;
  tileUrl: string; // kept for compatibility with existing callers (tab toggle)
  customIcon: CustomIconLike;
}> = ({ latLng, tileUrl, customIcon }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup previous map if any
    if (mapRef.current) {
      markerRef.current?.remove();
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }

    // Use the tileUrl passed from props as the style
    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: tileUrl,
      center: [latLng.lng, latLng.lat],
      zoom: 15,
      attributionControl: false,
      scrollZoom: false,
      doubleClickZoom: false,
    });

    // create marker element using provided icon-like object (keeps visual same)
    const el = document.createElement('div');
    el.style.display = 'inline-block';
    el.style.lineHeight = '0';
    el.style.pointerEvents = 'auto';

    const img = document.createElement('img');
    img.src = customIcon?.iconUrl ?? '';
    if (customIcon?.iconSize) {
      img.style.width = `${customIcon.iconSize[0]}px`;
      img.style.height = `${customIcon.iconSize[1]}px`;
    } else {
      img.style.width = '40px';
      img.style.height = '40px';
    }
    img.alt = 'marker';
    if (customIcon?.className) img.className = customIcon.className;

    el.appendChild(img);

    // position marker with anchor adjustments (maplibre Marker positions by element's top-left)
    // we'll add margin to mimic iconAnchor behaviour if provided
    if (customIcon?.iconAnchor) {
      // convert anchor so element bottom center aligns to coordinates
      const [ax, ay] = customIcon.iconAnchor;
      // apply transform so coordinate aligns similarly to Leaflet anchor
      el.style.transform = `translate(${
        -ax + (customIcon.iconSize ? customIcon.iconSize[0] / 2 : 20)
      }px, ${-ay}px)`;
    } else {
      el.style.transform = 'translate(-20px, -40px)';
    }
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    markerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(mapRef.current);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latLng.lat, latLng.lng, tileUrl, customIcon]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
