// Service for fetching city-related data (map, services, updates)
// Data structure for map and registration info
type MapData = {
  userCenter: [number, number];
  registrations: Array<{
    name: string;
    type: string;
    period: string;
    date: string;
    info: string;
  }>;
  contacts: Array<{
    label: string;
    phone: string;
  }>;
};

// Data structure for a single city service entry
type ServiceEntry = {
  serviceTitle: string;
  department?: string;
  processingTime: string;
  serviceLocation: string;
  contact: string;
  requiredDocuments: boolean;
  applyLink: string;
  title?: string; 
};

// Data structure for all city services
type ServicesData = {
  cityServices: ServiceEntry[];
};

// Data structure for a city update/alert
type CityUpdate = {
  title: string;
  subtype: string;
  description: string;
  date: string;
  type: string;
  mapZone: {
    center: [number, number];
    affectRadius: number;
  };
};

// Service class for fetching city map, services, and updates from API
class CityService {
  // Fetch map and registration data
  static async fetchMapData(): Promise<MapData> {
    const response = await fetch('http://localhost:3000/map');
    if (!response.ok) throw new Error('Failed to fetch map data');
    return response.json();
  }

  // Fetch all city services
  static async fetchServices(): Promise<ServicesData> {
    const response = await fetch('http://localhost:3000/services');
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  }

  // Fetch city updates/alerts
  static async fetchCityUpdates(): Promise<CityUpdate[]> {
    const response = await fetch('http://localhost:3000/cityUpdates');
    if (!response.ok) throw new Error('Failed to fetch city updates');
    return response.json();
  }
}

export default CityService;
export type { MapData, ServicesData, CityUpdate };