// Represents a property record with all details
export interface PropertyItem {
  id: string;
  pId: string;
  propertyNo?: string;
  type: string;
  description: string;
  address: string;
  dueDate: string;
  status: string;
  phoneNumber: string;
  area: string;
  propertyType: string;
  isVerified: boolean;
  isDraft: boolean;
  isNew: boolean;
  createdDate: string;
  gisData?: {
    latitude: number;
    longitude: number;
    coordinates?: any[];
  };
}

// Represents a user (citizen or agent)
export interface User {
  id: string;
  name: string;
  role: string;
  agentId?: string;
}

// Represents a location with address and coordinates
export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Filters for searching properties or users
export interface SearchFilters {
  ownerName?: string;
  location?: string;
  phoneNumber?: string;
  propertyId?: string;
}

// Represents a property location for mapping
export interface PropertyLocation {
  id: string;
  applicationNo: string;
  lat: number;
  lng: number;
  address: string;
  status: string;
}

// Tab options for map view
export type MapTab = 'Map' | 'Land Use';
// Tab options for calendar/status view
export type CalendarTab = 'All' | 'New' | 'Reviewed' | 'Draft';
// Tab options for main navigation
export type NavigationTab = 'home' | 'inbox' | 'notifications' | 'search';
