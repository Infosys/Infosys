

// Property.ts
// TypeScript interfaces for representing property, address, and location data for Citizen features.
export interface Address {
  street: string;
  wardNo: string;
  zoneNo: string;
  blockNo: string;
  pincode: string;
  locality: string;
  electionWard: string;
  secretariatWard: string;
  isCorrespondenceAddressDifferent: boolean;
}

// Geographic coordinates (latitude/longitude)
export interface Coordinates {
  lat: number;
  lng: number;
}

// Location and GIS data for a property, including drawn shapes
export interface LocationData {
  address: string;
  coordinates: Coordinates;
  timestamp: string;
  drawnShapes?: Array<{
    type: 'point' | 'rectangle' | 'polygon';
    coordinates: number[] | number[][];
    area?: number;
    address?: string;
  }>;
}

// Main property structure for Citizen features
export interface Property {
  // Unique property identifier
  id: string;

  // Address details, fully typed
  address: Address;

  // Progress of enumeration (e.g. survey progress)
  enumerationProgress: number;

  // Location metadata including geo coordinates and address string
  locationData: LocationData;
}