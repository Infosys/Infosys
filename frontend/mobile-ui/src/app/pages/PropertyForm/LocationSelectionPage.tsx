import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import LocationMapWithDrawing from './LocationMapWithDrawing';
import undoIcon from '../../assets/Agent/undo.svg';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { usePropertyInformationLocalization } from '../../../services/AgentLocalisation/localisation-propertyInformation';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../../styles/LocationSelection.css';

// Constants
const AREA_EPSILON = 1e-9;
const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_MIN_LENGTH = 2;
const AUTOCOMPLETE_LIMIT = 5;
const SINGLE_RESULT_LIMIT = 1;
const MAP_ZOOM_LEVEL = 16;
const MAP_CENTER_DELAY = 500;
const MAX_PROPERTY_OPTIONS = 5;
const INDIA_LAT_MIN = 8;
const INDIA_LAT_MAX = 37;
const INDIA_LNG_MIN = 68;
const INDIA_LNG_MAX = 97;
const MIN_POLYGON_POINTS = 3;
const DEFAULT_BANGALORE_CENTER: [number, number] = [77.5946, 12.9716];

// India major cities for fallback geocoding
const INDIA_CITIES = {
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
  delhi: { lat: 28.6139, lng: 77.209, name: 'Delhi' },
  mumbai: { lat: 19.076, lng: 72.8777, name: 'Mumbai, Maharashtra' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
  hyderabad: { lat: 17.385, lng: 78.4867, name: 'Hyderabad, Telangana' },
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
} as const;

// Type definitions
interface LocationData {
  coordinates: [number, number];
  address: string;
}

interface ShapeData {
  type: 'point' | 'polyline' | 'rectangle' | 'polygon' | 'deleted';
  coordinates?: number[] | number[][];
  area?: number;
  layer?: string;
  address?: string;
  addedAt?: string;
}

interface PropertyOption {
  address: string;
  coordinates: { lat: number; lng: number } | null;
  id: string;
}

interface SearchResult {
  id: number;
  displayName: string;
  coordinates: [number, number];
  type: string;
}

interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    housenumber?: string;
    street?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    name?: string;
    type?: string;
  };
}

// Helper: Build address parts from properties
const buildAddressParts = (props: PhotonFeature['properties']): string[] => {
  const parts: string[] = [];
  if (props.housenumber) parts.push(props.housenumber);
  if (props.street) parts.push(props.street);
  if (props.district) parts.push(props.district);
  if (props.city) parts.push(props.city);
  if (props.state) parts.push(props.state);
  return parts;
};

// Helper: Find nearest India city
const findNearestIndiaCity = (lat: number, lng: number): string => {
  let closestArea = 'Unknown Area, India';
  let minDistance = Infinity;

  Object.values(INDIA_CITIES).forEach((city) => {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestArea = city.name;
    }
  });

  return `Near ${closestArea}`;
};

// Helper: Format coordinates as location string
const formatLocationString = (lat: number, lng: number): string =>
  `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;

// Helper: Extract address from geocoding response
const extractAddressFromResponse = (data: { features?: PhotonFeature[] }): string | null => {
  if (!data.features?.length) return null;

  const props = data.features[0].properties;
  if (!props) return null;

  const parts = buildAddressParts(props);
  if (parts.length > 0) return parts.join(', ');
  if (props.name) return props.name;

  return null;
};

// Helper: Check if coordinates are in India
const isInIndia = (lat: number, lng: number): boolean =>
  lat >= INDIA_LAT_MIN && lat <= INDIA_LAT_MAX && lng >= INDIA_LNG_MIN && lng <= INDIA_LNG_MAX;

// Helper: Get reverse geocoded address with fallback
const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const address = extractAddressFromResponse(data);
      if (address) return address;
    }
  } catch {
    // Silent fail, use fallback
  }

  // Fallback to India cities if in India
  if (isInIndia(lat, lng)) {
    return findNearestIndiaCity(lat, lng);
  }

  return formatLocationString(lat, lng);
};

// Helper: Calculate centroid of a polygon
const calculatePolygonCentroid = (
  coordinates: number[][]
): { lat: number; lng: number } => {
  if (!coordinates?.length) {
    return { lat: DEFAULT_BANGALORE_CENTER[1], lng: DEFAULT_BANGALORE_CENTER[0] };
  }

  const pts = coordinates.map(([lng, lat]) => ({ x: lng, y: lat }));
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

  if (Math.abs(area) < AREA_EPSILON) {
    const avg = pts.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );
    return { lat: avg.y / pts.length, lng: avg.x / pts.length };
  }

  return { lat: ySum / (6 * area), lng: xSum / (6 * area) };
};

// Helper: Validate and swap coordinates if needed
const validateCoordinates = (lat: number, lng: number): [number, number] => {
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return [lng, lat];
  }
  return [lat, lng];
};

// Helper: Deduplicate property options
const deduplicatePropertyOptions = (options: PropertyOption[]): PropertyOption[] => {
  const seen = new Map<string, PropertyOption>();
  let doNotConsider: PropertyOption | null = null;

  for (const option of options) {
    if (option.address === 'do_not_consider_key') {
      doNotConsider = option;
      continue;
    }
    const key = (option.address || '').trim();
    if (!seen.has(key)) {
      seen.set(key, option);
    }
  }

  const result = Array.from(seen.values());
  if (doNotConsider) result.push(doNotConsider);
  return result;
};

// Main component
const LocationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateForm, formData } = usePropertyForm();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const mode = urlParams.get('mode');
  const {
    previousBtn,
    newPropertyFormTitle,
    addLocationTitle,
    searchPlaceholder,
    startDrawingBtn,
    finishDrawingBtn,
    selectedLocationTitle,
    loadingAddressText,
    multiplePropertiesTitle,
    loadingPropertiesText,
    noPropertiesText,
    confirmLocationBtn,
    doNotConsiderText,
  } = usePropertyInformationLocalization();

  // Initialize selected location from form data
  const getInitialLocation = (): LocationData => {
    if (formData.locationData) {
      if (mode === 'polygon' && formData.locationData.drawnShapes) {
        const existingPolygon = formData.locationData.drawnShapes.find(
          (shape) => shape.type === 'polygon'
        );
        if (existingPolygon?.coordinates) {
          const centroid = calculatePolygonCentroid(
            existingPolygon.coordinates as number[][]
          );
          return {
            coordinates: [centroid.lng, centroid.lat],
            address:
              formData.locationData.address ||
              `Centroid: ${centroid.lat.toFixed(6)}, ${centroid.lng.toFixed(6)}`,
          };
        }
      }
      return {
        coordinates: [
          formData.locationData.coordinates?.lng ?? DEFAULT_BANGALORE_CENTER[0],
          formData.locationData.coordinates?.lat ?? DEFAULT_BANGALORE_CENTER[1],
        ],
        address: formData.locationData.address || '',
      };
    }
    return {
      coordinates: DEFAULT_BANGALORE_CENTER,
      address: 'Vittal Mallya Road, Richmond Town, Bengaluru, Karnataka',
    };
  };

  // State declarations
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(getInitialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [polygonActive, setPolygonActive] = useState(false);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState<number>(0);
  const [propertyOptions, setPropertyOptions] = useState<PropertyOption[]>([]);
  const [loadingPropertyOptions, setLoadingPropertyOptions] = useState<boolean>(false);
  const [locationLocked, setLocationLocked] = useState<boolean>(false);
  const [drawingPointCount, setDrawingPointCount] = useState<number>(0);
  const [drawnShapes, setDrawnShapes] = useState<ShapeData[]>(() => {
    if (formData.locationData?.drawnShapes) {
      return formData.locationData.drawnShapes.map((shape, index) => ({
        type: shape.type,
        coordinates: shape.coordinates,
        area: shape.area,
        address: shape.address,
        layer: `existing_${index}`,
      }));
    }
    return [];
  });

  // Refs
  const polygonControlRef = useRef<{
    finish?: () => void;
    start?: () => void;
    clear?: () => void;
  } | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate property options from polygon shape
  const generatePropertyOptions = useCallback(async (polygon: ShapeData): Promise<PropertyOption[]> => {
    if (!polygon.coordinates || polygon.type !== 'polygon') return [];

    const coords = polygon.coordinates as number[][];
    const properties: PropertyOption[] = [];

    if (coords.length > MIN_POLYGON_POINTS) {
      const limit = Math.min(coords.length, MAX_PROPERTY_OPTIONS);

      for (let index = 0; index < limit; index++) {
        const coord = coords[index];
        const [validLat, validLng] = validateCoordinates(coord[1], coord[0]);

        try {
          const address = await getReverseGeocodedAddress(validLat, validLng);
          if (address && !address.startsWith('Location:') && !address.startsWith('Near')) {
            properties.push({
              address,
              coordinates: { lat: validLat, lng: validLng },
              id: `property_${index}`,
            });
          }
        } catch {
          // Skip failed geocoding
        }
      }
    }

    properties.push({
      address: 'do_not_consider_key',
      coordinates: null,
      id: 'not_considered',
    });

    return properties;
  }, []);

  // Handle location update from map
  const handleLocationUpdate = useCallback((lat: number, lng: number, address: string) => {
    if (locationLocked) {
      setIsLoading(false);
      return;
    }
    setSelectedLocation({ coordinates: [lng, lat], address });
    setIsLoading(false);
  }, [locationLocked]);

  // Handle shape drawn or deleted on the map
  const handleShapeDrawn = useCallback(async (shapeData: ShapeData) => {
    if (shapeData.type === 'deleted') {
      setDrawnShapes((prev) => prev.filter((shape) => shape.layer !== shapeData.layer));
      const remainingPolygons = drawnShapes.filter(
        (shape) => shape.type === 'polygon' && shape.layer !== shapeData.layer
      );
      if (remainingPolygons.length === 0) {
        setPropertyOptions([]);
      }
      return;
    }

    setDrawnShapes((prev) => {
      const existingIndex = prev.findIndex((shape) => shape.layer === shapeData.layer);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = shapeData;
        return updated;
      }
      return [...prev, shapeData];
    });

    if (shapeData.type === 'polygon') {
      setLoadingPropertyOptions(true);
      try {
        if (mode === 'polygon') {
          setDrawnShapes((prev) => {
            const nonPolygonShapes = prev.filter((shape) => shape.type !== 'polygon');
            return [...nonPolygonShapes, shapeData];
          });
        }

        const options = await generatePropertyOptions(shapeData);
        const deduped = deduplicatePropertyOptions(options);
        setPropertyOptions(deduped);

        const realOptions = deduped.filter((o) => o.address !== 'do_not_consider_key');
        if (realOptions.length === 1) {
          const idx = deduped.findIndex((o) => o.id === realOptions[0].id);
          if (idx >= 0) setSelectedPropertyIndex(idx);
        } else {
          setSelectedPropertyIndex(deduped.length - 1);
        }
      } catch {
        setPropertyOptions([]);
      } finally {
        setLoadingPropertyOptions(false);
      }
    }
  }, [mode, drawnShapes, generatePropertyOptions]);

  // Perform address/location search
  const performSearch = useCallback(async (query: string, isAutocomplete: boolean = false) => {
    if (!query.trim()) return;

    try {
      if (isAutocomplete) {
        setSearchLoading(true);
      } else {
        setIsLoading(true);
      }

      const limit = isAutocomplete ? AUTOCOMPLETE_LIMIT : SINGLE_RESULT_LIMIT;
      const response = await fetch(
        `https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features?.length > 0) {
          if (isAutocomplete) {
            const formattedResults = data.features.map((feature: PhotonFeature, index: number) => {
              const coords = feature.geometry.coordinates;
              const props = feature.properties;
              const parts = buildAddressParts(props);
              if (props.name && !parts.includes(props.name)) parts.unshift(props.name);
              if (props.country) parts.push(props.country);

              const displayName = parts.length > 0
                ? parts.join(', ')
                : formatLocationString(coords[1], coords[0]);

              return {
                id: index,
                displayName,
                coordinates: [coords[1], coords[0]] as [number, number],
                type: props.type || 'location',
              };
            });
            setSearchResults(formattedResults);
            setShowSearchResults(true);
          } else {
            const feature = data.features[0];
            const coords = feature.geometry.coordinates;
            await selectLocation(coords[1], coords[0]);
          }
        } else if (isAutocomplete) {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      }
    } catch {
      // Silent fail
    } finally {
      if (isAutocomplete) {
        setSearchLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // Select a location from search or map
  const selectLocation = useCallback(async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const address = await getReverseGeocodedAddress(lat, lng);
      setSelectedLocation({ coordinates: [lng, lat], address });

      if (mapRef.current) {
        mapRef.current.jumpTo({ center: [lng, lat], zoom: MAP_ZOOM_LEVEL });
      }
      setShowSearchResults(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > SEARCH_MIN_LENGTH) {
      searchTimeoutRef.current = setTimeout(() => {
        void performSearch(value, true);
      }, SEARCH_DEBOUNCE_MS);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [performSearch]);

  // Handle search result click
  const handleSearchResultClick = useCallback((result: SearchResult) => {
    setSearchQuery(result.displayName);
    void selectLocation(result.coordinates[0], result.coordinates[1]);
  }, [selectLocation]);

  // Handle search button click
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      void performSearch(searchQuery, false);
      setShowSearchResults(false);
    }
  }, [searchQuery, performSearch]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Clear all shapes
  const handleClearAll = useCallback(() => {
    try {
      polygonControlRef.current?.clear?.();
    } catch {
      // Ignore errors
    }
    setDrawnShapes([]);
    setPropertyOptions([]);
    setDrawingPointCount(0);
    updateForm({
      locationData: {
        gisDataId: formData.locationData?.gisDataId,
        drawnShapes: [],
        coordinates: {},
        address: '',
      },
    });
  }, [formData.locationData?.gisDataId, updateForm]);

  // Helper: Get address and coordinates for polygon property
  const getPolygonPropertyData = useCallback(
    async (
      firstPolygon: ShapeData,
      selectedPropertyIndex: number,
      propertyOptions: PropertyOption[]
    ): Promise<{ address: string; coords: { lat: number; lng: number } }> => {
      if (selectedPropertyIndex < propertyOptions.length) {
        const selectedProperty = propertyOptions[selectedPropertyIndex];
        if (selectedProperty.coordinates) {
          return {
            address: selectedProperty.address,
            coords: selectedProperty.coordinates,
          };
        }
      }

      // Fallback to first coordinate
      const coords = (firstPolygon.coordinates as number[][]) || [];
      if (coords.length > 0) {
        const firstCoord = coords[0];
        const [validLat, validLng] = validateCoordinates(firstCoord[1], firstCoord[0]);

        try {
          setIsLoading(true);
          const address = await getReverseGeocodedAddress(validLat, validLng);
          return { address, coords: { lat: validLat, lng: validLng } };
        } catch {
          return {
            address: `${validLat.toFixed(6)}, ${validLng.toFixed(6)}`,
            coords: { lat: validLat, lng: validLng },
          };
        } finally {
          setIsLoading(false);
        }
      }

      // Ultimate fallback
      return {
        address: selectedLocation.address,
        coords: {
          lat: selectedLocation.coordinates[1],
          lng: selectedLocation.coordinates[0],
        },
      };
    },
    [selectedLocation]
  );

  // Helper: Get address and coordinates for point property
  const getPointPropertyData = useCallback(
    async (pinned: ShapeData): Promise<{ address: string; coords: { lat: number; lng: number } }> => {
      if (!pinned.coordinates || (pinned.coordinates as number[]).length < 2) {
        return {
          address: selectedLocation.address,
          coords: {
            lat: selectedLocation.coordinates[1],
            lng: selectedLocation.coordinates[0],
          },
        };
      }

      const [validLat, validLng] = validateCoordinates(
        (pinned.coordinates as number[])[1],
        (pinned.coordinates as number[])[0]
      );

      if (pinned.address) {
        return { address: pinned.address, coords: { lat: validLat, lng: validLng } };
      }

      try {
        setIsLoading(true);
        const address = await getReverseGeocodedAddress(validLat, validLng);
        return { address, coords: { lat: validLat, lng: validLng } };
      } catch {
        return {
          address: `${validLat.toFixed(6)}, ${validLng.toFixed(6)}`,
          coords: { lat: validLat, lng: validLng },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedLocation]
  );

  // Handle confirm location
  const handleConfirmLocation = useCallback(async () => {
    const firstPolygon = drawnShapes.find((s) => s.type === 'polygon');
    let addressToSave = selectedLocation.address;
    let coordsToSave = {
      lat: selectedLocation.coordinates[1],
      lng: selectedLocation.coordinates[0],
    };

    if (firstPolygon && propertyOptions.length > 0) {
      const result = await getPolygonPropertyData(firstPolygon, selectedPropertyIndex, propertyOptions);
      addressToSave = result.address;
      coordsToSave = result.coords;
    } else {
      const pinned = drawnShapes.find((s) => s.type === 'point');
      if (pinned) {
        const result = await getPointPropertyData(pinned);
        addressToSave = result.address;
        coordsToSave = result.coords;
      }
    }

    const locationData = {
      gisDataId: formData.locationData?.gisDataId,
      address: addressToSave,
      coordinates: coordsToSave,
      timestamp: new Date().toISOString(),
      drawnShapes: drawnShapes
        .filter((shape) => shape.type !== 'deleted' && shape.type !== 'polyline')
        .map((shape) => ({
          type: shape.type as 'point' | 'rectangle' | 'polygon',
          coordinates: shape.coordinates || [],
          area: shape.area,
          address: shape.address,
          addedAt: shape.addedAt,
        })),
    };
    updateForm({ locationData });
    navigate(-1);
  }, [
    drawnShapes,
    selectedLocation,
    propertyOptions,
    selectedPropertyIndex,
    formData.locationData?.gisDataId,
    updateForm,
    navigate,
    getPolygonPropertyData,
    getPointPropertyData,
  ]);

  // Initial reverse geocode
  useEffect(() => {
    const reverseGeocode = async () => {
      try {
        setIsLoading(true);
        const address = await getReverseGeocodedAddress(
          selectedLocation.coordinates[1],
          selectedLocation.coordinates[0]
        );
        setSelectedLocation((prev) => ({ ...prev, address }));
      } catch {
        setSelectedLocation((prev) => ({
          ...prev,
          address: `${selectedLocation.coordinates[1].toFixed(6)}, ${selectedLocation.coordinates[0].toFixed(6)}`,
        }));
      } finally {
        setIsLoading(false);
      }
    };
    void reverseGeocode();
  }, []);

  // Center map on polygon centroid
  useEffect(() => {
    if (mode === 'polygon' && mapRef.current) {
      const existingPolygon = drawnShapes.find((s) => s.type === 'polygon');
      if (existingPolygon?.coordinates) {
        const centroid = calculatePolygonCentroid(existingPolygon.coordinates as number[][]);
        setTimeout(() => {
          mapRef.current?.flyTo({
            center: [centroid.lng, centroid.lat],
            zoom: MAP_ZOOM_LEVEL,
          });
        }, MAP_CENTER_DELAY);
      }
    }
  }, [mode, drawnShapes]);

  // Load property options for existing polygon
  useEffect(() => {
    const loadExistingPolygonOptions = async () => {
      const existingPolygon = drawnShapes.find((s) => s.type === 'polygon');
      if (existingPolygon && mode !== 'polygon') {
        setLoadingPropertyOptions(true);
        try {
          const options = await generatePropertyOptions(existingPolygon);
          const deduped = deduplicatePropertyOptions(options);
          setPropertyOptions(deduped);
          setSelectedPropertyIndex(deduped.length - 1);
        } catch {
          setPropertyOptions([]);
        } finally {
          setLoadingPropertyOptions(false);
        }
      } else if (mode === 'polygon') {
        setPropertyOptions([]);
        setSelectedPropertyIndex(0);
      }
    };
    void loadExistingPolygonOptions();
  }, []);

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Hide search results on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-bar-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const realPropertyOptions = propertyOptions.filter((p) => p.address !== 'do_not_consider_key');
  const showPropertyList = realPropertyOptions.length !== 1;

  return (
    <div className="location-selection-container">
      <div className="location-header1">
        <div className="header-content1">
          <h1 className="form-title">{newPropertyFormTitle}</h1>
          <p className="form-subtitle">{addLocationTitle}</p>
          <button className="back-button1" onClick={handleBack}>
            <ArrowBackIosNewIcon style={{ fontSize: '16px', color: '#C84C0E' }} />
            <span className="back-text">{previousBtn}</span>
          </button>
        </div>
      </div>
      <div className="map-wrapper">
        <div className="search-bar-container">
          <div className="map-search-bar">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                } else if (e.key === 'Escape') {
                  setShowSearchResults(false);
                }
              }}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
              className="map-search-input"
            />
            <button
              className="map-search-btn"
              onClick={handleSearch}
              disabled={isLoading || searchLoading}
              aria-label="Search"
            >
              {searchLoading ? (
                <div className="search-spinner"></div>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className="search-result-item"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <div className="search-result-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="search-result-text">
                    <div className="search-result-name">{result.displayName}</div>
                    <div className="search-result-type">{result.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {(mode === 'polygon' || polygonActive) && (
            <div className="polygon-control-buttons">
              <div className="polygon-control-refresh-container">
                <IconButton
                  size="small"
                  aria-label="clear-polygon"
                  onClick={handleClearAll}
                  title="Clear drawings"
                  className="polygon-control-refresh"
                >
                  <img src={undoIcon} alt="Undo" style={{ width: '20px', height: '20px' }} />
                </IconButton>
              </div>
              <button
                className="polygon-control-btn start"
                onClick={() => {
                  setPolygonActive(true);
                  polygonControlRef.current?.start?.();
                }}
                title={startDrawingBtn}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="3,6 9,6 9,3 21,9 9,15 9,12 3,12"></polygon>
                </svg>
                {startDrawingBtn}
              </button>
              <button
                className="polygon-control-btn finish"
                disabled={drawingPointCount < MIN_POLYGON_POINTS}
                onClick={() => {
                  polygonControlRef.current?.finish?.();
                  setPolygonActive(false);
                  setDrawingPointCount(0);
                }}
                title={
                  drawingPointCount < MIN_POLYGON_POINTS
                    ? 'Need at least 3 points to finish polygon'
                    : finishDrawingBtn
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
                {finishDrawingBtn}
              </button>
            </div>
          )}
        </div>
        <div className="location-map-container">
          <LocationMapWithDrawing
            center={[selectedLocation.coordinates[1], selectedLocation.coordinates[0]]}
            onLocationUpdate={handleLocationUpdate}
            onShapeDrawn={handleShapeDrawn}
            initialShapes={formData.locationData?.drawnShapes || []}
            onClearAll={handleClearAll}
            externalFinishRef={polygonControlRef}
            startDrawing={polygonActive}
            externalMapRef={mapRef}
            onLocationLockChange={setLocationLocked}
            onDrawingPathChange={setDrawingPointCount}
          />
        </div>
      </div>
      <div className="location-bottom-panel">
        <div className="selected-location-section">
          <h3>{selectedLocationTitle}</h3>
          <div className="location-address">
            {isLoading ? (
              <p className="loading-address">{loadingAddressText}</p>
            ) : (
              <p>{selectedLocation.address}</p>
            )}
          </div>
        </div>
        {drawnShapes.some((shape) => shape.type === 'polygon') && (
          <div className="selected-location-section">
            <h3>{multiplePropertiesTitle}</h3>
            {loadingPropertyOptions && (
              <div className="properties-list">
                <p className="loading-address">{loadingPropertiesText}</p>
              </div>
            )}
            {!loadingPropertyOptions && propertyOptions.length === 0 && (
              <div className="properties-list">
                <p>{noPropertiesText}</p>
              </div>
            )}
            {!loadingPropertyOptions && propertyOptions.length > 0 && (
              <div className="properties-list">
                {showPropertyList ? (
                  propertyOptions.map((property, index) => (
                    <div
                      key={property.id}
                      className={`property-item ${selectedPropertyIndex === index ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        id={`property-${index}`}
                        name="selectedProperty"
                        checked={selectedPropertyIndex === index}
                        onChange={() => setSelectedPropertyIndex(index)}
                        className="property-radio"
                      />
                      <label htmlFor={`property-${index}`} className="property-text">
                        {property.address === 'do_not_consider_key'
                          ? doNotConsiderText
                          : property.address}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="property-item single">
                    <div className="property-text">{realPropertyOptions[0].address}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <button
          className="confirm-location-btn"
          onClick={handleConfirmLocation}
          disabled={isLoading || polygonActive}
          title={
            polygonActive
              ? 'Please finish drawing the polygon before confirming the location.'
              : undefined
          }
        >
          {confirmLocationBtn}
        </button>
      </div>
    </div>
  );
};

export default LocationSelectionPage;
