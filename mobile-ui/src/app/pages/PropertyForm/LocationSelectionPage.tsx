import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import LocationMapWithDrawing from './LocationMapWithDrawing';
import undoIcon from '../../assets/Agent/undo.svg';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { usePropertyInformationLocalization } from '../../../services/AgentLocalisation/localisation-propertyInformation';
// Remove Leaflet import
// import L from 'leaflet';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../../styles/LocationSelection.css';

// Helper function to get reverse geocoded address with fallback
const getReverseGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    // Use Photon API which is CORS-friendly
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

          // Build address from available components
          if (props.housenumber) parts.push(props.housenumber);
          if (props.street) parts.push(props.street);
          if (props.district) parts.push(props.district);
          if (props.city) parts.push(props.city);
          if (props.state) parts.push(props.state);

          if (parts.length > 0) {
            return parts.join(', ');
          }

          // Fallback to name if available
          if (props.name) {
            return props.name;
          }
        }
      }
    }
  } catch (error) {
    console.warn('Photon geocoding failed, trying alternative:', error);
  }

  // Try alternative approach with a simple area lookup
  try {
    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
      const areas = {
        bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
        delhi: { lat: 28.6139, lng: 77.209, name: 'Delhi' },
        mumbai: { lat: 19.076, lng: 72.8777, name: 'Mumbai, Maharashtra' },
        chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
        hyderabad: { lat: 17.385, lng: 78.4867, name: 'Hyderabad, Telangana' },
        pune: { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
      };
      let closestArea = 'Unknown Area, India';
      let minDistance = Infinity;
      Object.values(areas).forEach((area) => {
        const distance = Math.sqrt(
          Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestArea = area.name;
        }
      });
      return `Near ${closestArea}`;
    }
  } catch (error) {
    console.warn('Area lookup failed:', error);
  }
  return `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
};

// Helper function to calculate centroid of a polygon (matching LocationMapWithDrawing implementation)
const calculatePolygonCentroid = (
  coordinates: number[][]
): { lat: number; lng: number } => {
  if (!coordinates || coordinates.length === 0) {
    return { lat: 12.9716, lng: 77.5946 };
  }
  // Fixed: MapLibre coordinates are [lng, lat], so we need to swap
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
  if (Math.abs(area) < 1e-9) {
    const avg = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
      x: 0,
      y: 0,
    });
    const result = { lat: avg.y / pts.length, lng: avg.x / pts.length };
    return result;
  }
  const cx = xSum / (6 * area);
  const cy = ySum / (6 * area);
  const result = { lat: cy, lng: cx };
  return result;
};

// Type for location data (coordinates and address)
interface LocationData {
  coordinates: [number, number]; // [lng, lat] for MapLibre
  address: string;
}

// Type for drawn shape data (point, polygon, etc.)
interface ShapeData {
  type: 'point' | 'polyline' | 'rectangle' | 'polygon' | 'deleted';
  coordinates?: number[] | number[][];
  area?: number;
  layer?: any;
  address?: string;
  addedAt?: string;
}

// Main component for selecting and confirming property location on a map
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

  // State for selected location (coordinates and address)
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(() => {
    if (formData.locationData) {
      if (mode === 'polygon' && formData.locationData.drawnShapes) {
        const existingPolygon = formData.locationData.drawnShapes.find(
          (shape) => shape.type === 'polygon'
        );
        if (existingPolygon && existingPolygon.coordinates) {
          const centroid = calculatePolygonCentroid(
            existingPolygon.coordinates as number[][]
          );
          return {
            coordinates: [centroid.lng!, centroid.lat!],
            address:
              formData.locationData.address ||
              `Centroid: ${centroid.lat.toFixed(6)}, ${centroid.lng.toFixed(6)}`,
          };
        }
      }
      return {
        coordinates: [
          formData.locationData.coordinates?.lng!,
          formData.locationData.coordinates?.lat!,
        ],
        address: formData.locationData.address,
      };
    }
    return {
      coordinates: [77.5946, 12.9716], // [lng, lat]
      address: 'Vittal Mallya Road, Richmond Town, Bengaluru, Karnataka',
    };
  });

  // State for loading, search, polygon, and map refs
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [polygonActive, setPolygonActive] = useState(false);
  const polygonControlRef = useRef<{
    finish?: () => void;
    start?: () => void;
    clear?: () => void;
  } | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState<number>(0);
  const [propertyOptions, setPropertyOptions] = useState<any[]>([]);
  const [loadingPropertyOptions, setLoadingPropertyOptions] = useState<boolean>(false);
  const [locationLocked, setLocationLocked] = useState<boolean>(false);

  // State for drawn shapes on the map
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

  // Handle location update from map (pin or move)
  const handleLocationUpdate = (lat: number, lng: number, address: string) => {
    // If the map locked the location (after polygon finish), ignore further map move/zoom events
    if (locationLocked) {
      setIsLoading(false);
      return;
    }
    setSelectedLocation({
      coordinates: [lng, lat], // [lng, lat]
      address: address,
    });
    setIsLoading(false);
  };

  // Handle shape drawn or deleted on the map
  const handleShapeDrawn = async (shapeData: ShapeData) => {
    if (shapeData.type === 'deleted') {
      setDrawnShapes((prev) => prev.filter((shape) => shape.layer !== shapeData.layer));
      const remainingPolygons = drawnShapes.filter(
        (shape) => shape.type === 'polygon' && shape.layer !== shapeData.layer
      );
      if (remainingPolygons.length === 0) {
        setPropertyOptions([]);
      }
    } else {
      setDrawnShapes((prev) => {
        const existingIndex = prev.findIndex((shape) => shape.layer === shapeData.layer);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = shapeData;
          return updated;
        } else {
          return [...prev, shapeData];
        }
      });

      if (shapeData.type === 'polygon') {
        setLoadingPropertyOptions(true);
        try {
          if (mode === 'polygon') {
            setDrawnShapes((prev) => {
              const nonPolygonShapes = prev.filter((shape) => shape.type !== 'polygon');
              return [...nonPolygonShapes, shapeData];
            });

            // Note: selectedLocation is already updated by handleLocationUpdate with centroid address
            // No need to update it again here to avoid overriding the correct address
          }

          let options = await generatePropertyOptions(shapeData);
          // Deduplicate options by address (keep first occurrence). Keep the 'do_not_consider_key' item at the end.
          const dedupePropertyOptions = (opts: any[]) => {
            const seen = new Map<string, any>();
            let doNotConsider: any = null;
            for (const o of opts) {
              if (o.address === 'do_not_consider_key') {
                doNotConsider = o;
                continue;
              }
              const key = (o.address || '').trim();
              if (!seen.has(key)) {
                seen.set(key, o);
              }
            }
            const result = Array.from(seen.values());
            if (doNotConsider) result.push(doNotConsider);
            return result;
          };

          options = dedupePropertyOptions(options);
          setPropertyOptions(options);
          // If only one real property (not counting do_not_consider), auto-select it and hide list
          const realOptions = options.filter((o) => o.address !== 'do_not_consider_key');
          if (realOptions.length === 1) {
            const idx = options.findIndex((o) => o.id === realOptions[0].id);
            if (idx >= 0) setSelectedPropertyIndex(idx);
          } else {
            // default selection to last (do_not_consider) if multiple
            setSelectedPropertyIndex(options.length - 1);
          }
        } catch (error) {
          setPropertyOptions([]);
        } finally {
          setLoadingPropertyOptions(false);
        }
      }
    }
  };

  // Generate property options from polygon shape
  const generatePropertyOptions = async (polygon: ShapeData) => {
    if (!polygon.coordinates || polygon.type !== 'polygon') return [];
    const coords = polygon.coordinates as number[][];
    const properties = [];
    if (coords.length > 3) {
      for (let index = 0; index < coords.length && index < 5; index++) {
        const coord = coords[index];
        // MapLibre uses [lng, lat]
        let lng = coord[0];
        let lat = coord[1];

        // Validate coordinates
        if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
          // Swap if needed
          [lat, lng] = [lng, lat];
        }
        try {
          const address = await getReverseGeocodedAddress(lat, lng);
          if (
            address &&
            !address.startsWith('Location:') &&
            !address.startsWith('Near')
          ) {
            properties.push({
              address: address,
              coordinates: { lat, lng },
              id: `property_${index}`,
            });
          }
        } catch (error) {
          continue;
        }
      }
    }
    properties.push({
      address: 'do_not_consider_key',
      coordinates: null,
      id: 'not_considered',
    });
    return properties;
  };

  // Handle search input for address/location
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value, true);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Perform address/location search (autocomplete or direct)
  const performSearch = async (query: string, isAutocomplete: boolean = false) => {
    if (!query.trim()) return;
    try {
      if (isAutocomplete) {
        setSearchLoading(true);
      } else {
        setIsLoading(true);
      }
      const limit = isAutocomplete ? 5 : 1;
      const response = await fetch(
        `https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=${limit}`,
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
          if (isAutocomplete) {
            const formattedResults = data.features.map((feature: any, index: number) => {
              const coords = feature.geometry.coordinates;
              const props = feature.properties;
              const parts = [];
              if (props.name) parts.push(props.name);
              if (props.street) parts.push(props.street);
              if (props.city) parts.push(props.city);
              if (props.state) parts.push(props.state);
              if (props.country) parts.push(props.country);

              const displayName =
                parts.length > 0
                  ? parts.join(', ')
                  : `Location: ${coords[1].toFixed(4)}°, ${coords[0].toFixed(4)}°`;
              return {
                id: index,
                displayName,
                coordinates: [coords[1], coords[0]], // [lat, lng] for display
                type: props.type || 'location',
              };
            });
            setSearchResults(formattedResults);
            setShowSearchResults(true);
          } else {
            const feature = data.features[0];
            const coords = feature.geometry.coordinates;
            const lat = coords[1];
            const lng = coords[0];
            await selectLocation(lat, lng);
          }
        } else {
          if (isAutocomplete) {
            setSearchResults([]);
            setShowSearchResults(false);
          }
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      if (isAutocomplete) {
        setSearchLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Select a location from search or map
  const selectLocation = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const address = await getReverseGeocodedAddress(lat, lng);
      setSelectedLocation({
        coordinates: [lng, lat], // [lng, lat]
        address: address,
      });
      if (mapRef.current) {
        // MapLibre uses flyTo with center as [lng, lat]
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 16,
        });
      }
      setShowSearchResults(false);
    } catch (error) {
      console.error('Failed to select location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click on a search result
  const handleSearchResultClick = (result: any) => {
    setSearchQuery(result.displayName);
    selectLocation(result.coordinates[0], result.coordinates[1]);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, false);
      setShowSearchResults(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle confirm location button click (save to form)
  const handleConfirmLocation = async () => {
    const firstPolygon = drawnShapes.find((s) => s.type === 'polygon') as any | undefined;
    let addressToSave = selectedLocation.address;
    let coordsToSave = {
      lat: selectedLocation.coordinates[1],
      lng: selectedLocation.coordinates[0],
    };

    if (firstPolygon && propertyOptions.length > 0) {
      if (selectedPropertyIndex < propertyOptions.length) {
        const selectedProperty = propertyOptions[selectedPropertyIndex];
        if (selectedProperty.coordinates) {
          addressToSave = selectedProperty.address;
          coordsToSave = selectedProperty.coordinates;
        } else {
          const coords = (firstPolygon.coordinates as number[][]) || [];
          if (coords.length > 0) {
            const firstCoord = coords[0];
            // MapLibre coordinates are [lng, lat]
            let lng = firstCoord[0];
            let lat = firstCoord[1];

            // Validate
            if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
              [lat, lng] = [lng, lat];
            }
            try {
              setIsLoading(true);
              addressToSave = await getReverseGeocodedAddress(lat, lng);
            } catch (err) {
              addressToSave = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            } finally {
              setIsLoading(false);
            }
            coordsToSave = { lat, lng };
          }
        }
      }
    }

    if (!firstPolygon) {
      const pinned = drawnShapes.find((s) => s.type === 'point') as any | undefined;
      if (pinned && pinned.coordinates && (pinned.coordinates as number[]).length >= 2) {
        // MapLibre coordinates are [lng, lat]
        let plng = (pinned.coordinates as number[])[0];
        let plat = (pinned.coordinates as number[])[1];

        if (Math.abs(plat) > 90 || Math.abs(plng) > 180) {
          [plat, plng] = [plng, plat];
        }
        if (pinned.address) {
          addressToSave = pinned.address;
        } else {
          try {
            setIsLoading(true);
            addressToSave = await getReverseGeocodedAddress(plat, plng);
          } catch (err) {
            addressToSave = `${plat.toFixed(6)}, ${plng.toFixed(6)}`;
          } finally {
            setIsLoading(false);
          }
        }
        coordsToSave = { lat: plat, lng: plng };
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
          addedAt: (shape as any).addedAt,
        })),
    };
    updateForm({ locationData });
    navigate(-1);
  };

  // On mount: reverse geocode initial location
  useEffect(() => {
    const reverseGeocode = async () => {
      try {
        setIsLoading(true);
        const address = await getReverseGeocodedAddress(
          selectedLocation.coordinates[1], // lat
          selectedLocation.coordinates[0] // lng
        );
        setSelectedLocation((prev) => ({
          ...prev,
          address: address,
        }));
      } catch (error) {
        setSelectedLocation((prev) => ({
          ...prev,
          address: `${selectedLocation.coordinates[1].toFixed(
            6
          )}, ${selectedLocation.coordinates[0].toFixed(6)}`,
        }));
      } finally {
        setIsLoading(false);
      }
    };
    reverseGeocode();
  }, []);

  // On mount: center map on polygon centroid if present
  useEffect(() => {
    if (mode === 'polygon' && mapRef.current) {
      const existingPolygon = drawnShapes.find((s) => s.type === 'polygon');
      if (existingPolygon && existingPolygon.coordinates) {
        const centroid = calculatePolygonCentroid(
          existingPolygon.coordinates as number[][]
        );
        setTimeout(() => {
          if (mapRef.current) {
            // MapLibre uses flyTo with center as [lng, lat]
            mapRef.current.flyTo({
              center: [centroid.lng, centroid.lat],
              zoom: 16,
            });
          }
        }, 500);
      }
    }
  }, [mode, drawnShapes]);

  // On mount: load property options for existing polygon
  useEffect(() => {
    const loadExistingPolygonOptions = async () => {
      const existingPolygon = drawnShapes.find((s) => s.type === 'polygon');
      if (existingPolygon && mode !== 'polygon') {
        setLoadingPropertyOptions(true);
        try {
          const options = await generatePropertyOptions(existingPolygon);
          // Deduplicate options and keep do_not_consider at the end
          const dedupePropertyOptions = (opts: any[]) => {
            const seen = new Map<string, any>();
            let doNotConsider: any = null;
            for (const o of opts) {
              if (o.address === 'do_not_consider_key') {
                doNotConsider = o;
                continue;
              }
              const key = (o.address || '').trim();
              if (!seen.has(key)) {
                seen.set(key, o);
              }
            }
            const result = Array.from(seen.values());
            if (doNotConsider) result.push(doNotConsider);
            return result;
          };
          const deduped = dedupePropertyOptions(options);
          setPropertyOptions(deduped);
          setSelectedPropertyIndex(deduped.length - 1);
        } catch (error) {
          setPropertyOptions([]);
        } finally {
          setLoadingPropertyOptions(false);
        }
      } else if (mode === 'polygon') {
        setPropertyOptions([]);
        setSelectedPropertyIndex(0);
      }
    };
    loadExistingPolygonOptions();
  }, []);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Hide search results dropdown when clicking outside
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

  // Main render: map, search, polygon controls, property options, and confirm button
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
                <div
                  key={result.id}
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
                </div>
              ))}
            </div>
          )}
          {(mode === 'polygon' || polygonActive) && (
            <div className="polygon-control-buttons">
              <div className="polygon-control-refresh-container">
                <IconButton
                  size="small"
                  aria-label="clear-polygon"
                  onClick={() => {
                    try {
                      if (polygonControlRef.current && polygonControlRef.current.clear)
                        polygonControlRef.current.clear();
                    } catch (e) {
                      /* ignore */
                    }
                    setDrawnShapes([]);
                    setPropertyOptions([]);
                    updateForm({
                      locationData: {
                        gisDataId: formData.locationData?.gisDataId!,
                        drawnShapes: [],
                        coordinates: {},
                        address: '',
                      },
                    });
                  }}
                  title="Clear drawings"
                  className="polygon-control-refresh"
                >
                  <img
                    src={undoIcon}
                    alt="Undo"
                    style={{ width: '20px', height: '20px' }}
                  />
                </IconButton>
              </div>
              <button
                className={`polygon-control-btn start`}
                onClick={() => {
                  setPolygonActive(true);
                  if (polygonControlRef.current?.start) polygonControlRef.current.start();
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
                className={`polygon-control-btn finish`}
                onClick={() => {
                  if (polygonControlRef.current?.finish)
                    polygonControlRef.current.finish();
                  setPolygonActive(false);
                }}
                title={finishDrawingBtn}
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
            center={[selectedLocation.coordinates[1], selectedLocation.coordinates[0]]} // [lat, lng]
            onLocationUpdate={handleLocationUpdate}
            onShapeDrawn={handleShapeDrawn}
            initialShapes={formData.locationData?.drawnShapes || []}
            onClearAll={() => {
              setDrawnShapes([]);
              updateForm({
                locationData: {
                  gisDataId: formData.locationData?.gisDataId,
                  drawnShapes: [],
                  coordinates: {},
                  address: '',
                },
              });
            }}
            externalFinishRef={polygonControlRef}
            startDrawing={polygonActive}
            externalMapRef={mapRef}
            onLocationLockChange={(locked: boolean) => setLocationLocked(locked)}
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
        {drawnShapes.filter((shape) => shape.type === 'polygon').length > 0 && (
          <div className="selected-location-section">
            <h3>{multiplePropertiesTitle}</h3>
            {loadingPropertyOptions ? (
              <div className="properties-list">
                <p className="loading-address">{loadingPropertiesText}</p>
              </div>
            ) : propertyOptions.length > 0 ? (
              <div className="properties-list">
                {/* If there's exactly one real property (excluding 'do_not_consider_key') we skip rendering the list and auto-use it */}
                {propertyOptions.filter((p: any) => p.address !== 'do_not_consider_key')
                  .length === 1 ? (
                  <div className="property-item single">
                    <div className="property-text">
                      {
                        propertyOptions.find(
                          (p: any) => p.address !== 'do_not_consider_key'
                        )!.address
                      }
                    </div>
                  </div>
                ) : (
                  propertyOptions.map((property: any, index: number) => (
                    <div
                      key={property.id}
                      className={`property-item ${
                        selectedPropertyIndex === index ? 'selected' : ''
                      }`}
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
                )}
              </div>
            ) : (
              <div className="properties-list">
                <p>{noPropertiesText}</p>
              </div>
            )}
          </div>
        )}
        <button
          className="confirm-location-btn"
          onClick={handleConfirmLocation}
          disabled={isLoading}
        >
          {confirmLocationBtn}
        </button>
      </div>
    </div>
  );
};

export default LocationSelectionPage;
