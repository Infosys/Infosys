import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PropertyItem, RawApplication } from '../models/dataModels';

// Context value type for PropertyApplicationsContext
export interface PropertyApplicationsContextType {
  properties: PropertyItem[];           // For list/cards
  setProperties: (apps: PropertyItem[]) => void;
  resetProperties: () => void;

  fullProperties: RawApplication[];     // For full details
  setFullProperties: (apps: RawApplication[]) => void;
  resetFullProperties: () => void;
}

// Create PropertyApplicationsContext for sharing property application state
const PropertyApplicationsContext = createContext<PropertyApplicationsContextType | undefined>(undefined);

// Custom hook to access PropertyApplicationsContext
export const usePropertyApplications = () => {
  const ctx = useContext(PropertyApplicationsContext);
  if (!ctx) throw new Error("usePropertyApplications must be used within PropertyApplicationsProvider");
  return ctx;
};

// Provider component for PropertyApplicationsContext
export const PropertyApplicationsProvider = ({ children }: { children: ReactNode }) => {
  // State for property list (for cards/lists)
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  // State for full property details
  const [fullProperties, setFullProperties] = useState<RawApplication[]>([]);

  // Reset property list to empty
  const resetProperties = () => setProperties([]);
  // Reset full property details to empty
  const resetFullProperties = () => setFullProperties([]);

  // Provide property application state and handlers to children
  return (
    <PropertyApplicationsContext.Provider value={{
      properties,
      setProperties,
      resetProperties,
      fullProperties,
      setFullProperties,
      resetFullProperties
    }}>
      {children}
    </PropertyApplicationsContext.Provider>
  );
};