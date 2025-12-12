// SearchProperty.ts
// TypeScript interfaces for property search results and search screen data.
// Geographic coordinates for a property
export interface PropertyLocation {
  lat: number;
  lng: number;
}

// Result structure for a single property search result
export interface PropertySearchResult {
  id: string;
  status: "Verified" | "Pending";
  address: string;
  location: PropertyLocation;
}

// Data structure for the property search screen (options and results)
export interface SearchScreenData {
  propertySearchOptions: string[];
  propertySearchResults: PropertySearchResult[];
}