import type { Property } from "./Property.model";

// Represents the state for property selection (e.g., in Redux or React context)
export interface PropertyState {
  selectedProperty: Property | null; // Currently selected property, or null if none
}