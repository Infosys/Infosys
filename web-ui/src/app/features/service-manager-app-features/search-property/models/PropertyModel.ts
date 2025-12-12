// This file defines the Property interface, representing a simplified property model
// used for displaying property cards or lists in the UI.

// Represents a property with basic details for display
export interface Property {
  id: number;
  propertyName: string;
  propertyId: string;
  address: string;
  ward: string;
  zone: string;
  agentName: string;
  images: string[];
  mapImageUrl?: string;
  // Geographic location of the property (latitude/longitude)
  location: {
    lat: number,
    lng: number
  }
}