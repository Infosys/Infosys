// CityUpdatesContext.tsx
// React context for providing city map, services, and updates data to Citizen UI components.
import { createContext, useContext, type ReactNode, useState, useEffect } from "react";


// Types for map, services, and city update data (imported from service layer)
import type { MapData, ServicesData, CityUpdate } from "../../services/Citizen/MyCity/MyCityService";
import CityService from "../../services/Citizen/MyCity/MyCityService";

// Context value type for CityAppContext
interface CityAppContextType {
  mapData: MapData | null;
  servicesData: ServicesData | null;
  cityUpdates: CityUpdate[] | null;
  loading: boolean;
  error: string | null;
  refreshAll: () => void;
}

// Create CityAppContext for sharing city data across components
const CityAppContext = createContext<CityAppContextType | undefined>(undefined);

// Provider component for CityAppContext
export const CityAppProvider = ({ children }: { children: ReactNode }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [cityUpdates, setCityUpdates] = useState<CityUpdate[] | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Unified fetch: loads map, services, and city updates in parallel
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mapRes, serviceRes, updatesRes] = await Promise.all([
        CityService.fetchMapData(),
        CityService.fetchServices(),
        CityService.fetchCityUpdates()
      ]);
      setMapData(mapRes);
      setServicesData(serviceRes);
      setCityUpdates(updatesRes);
    } catch (err: any) {
      setError(typeof err === "string" ? err : err.message || "Unknown error");
      setMapData(null);
      setServicesData(null);
      setCityUpdates(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Expose refresh function to consumers
  const refreshAll = () => {
    fetchAll();
  };

  // Provide city data and loading/error state to children
  return (
    <CityAppContext.Provider
      value={{
        mapData,
        servicesData,
        cityUpdates,
        loading,
        error,
        refreshAll,
      }}
    >
      {children}
    </CityAppContext.Provider>
  );
};

// Custom hook for accessing city app data from context
export const useCityAppData = () => {
  const context = useContext(CityAppContext);
  if (!context) {
    throw new Error("useCityAppData must be used within a CityAppProvider");
  }
  return context;
};