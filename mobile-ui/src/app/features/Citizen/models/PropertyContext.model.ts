import type { Property } from "./Property.model";

// Represents the context type for managing property state in React context
export interface PropertyContextType {
  properties: Property[]; // List of all properties
  selectedProperty: Property | null; // Currently selected property
  setSelectedProperty: (property: Property | null) => void; // Function to set the selected property
  reloadProperties: () => void; // Function to reload property list
  loading: boolean; // Loading state for property operations
  error: string | null; // Error message, if any
}