import db from '../../json-server/db.json';

// Data service to fetch data from db.json
export interface PropertyItem {
  id: string;
  pId: string;
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
}

export interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phoneNumber: string;
}

export interface Message {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'tax' | 'verification' | 'notification';
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface InsightData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export interface PropertyInsight {
  id: string;
  address: string;
  marketValue: string;
  taxAmount: string;
  lastAssessment: string;
  appreciation: string;
}

export interface Draft {
  id: string;
  title: string;
  description: string;
  address: string;
  savedDate: string;
  dueDate: string;
}

export interface DatabaseData {
  properties: PropertyItem[];
  location: LocationData;
  searchResults: PropertyItem[];
  messages: Message[];
  insights: {
  overview: InsightData[];
  properties: PropertyInsight[];
  };
  drafts: Draft[];
}

// Fetch properties from API endpoint
export const fetchProperties = async (): Promise<PropertyItem[]> => {
  try {
    // Return properties directly from local db.json
    return db.properties as PropertyItem[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

// Fetch all data from db.json (keeping for other data like location, messages, etc.)
export const fetchData = async (): Promise<DatabaseData> => {
  try {
    // Fetch properties from API endpoint
    const properties = await fetchProperties();
    
    // Fetch other data from static JSON file
    const response = await fetch('/db.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const staticData = await response.json();
    
    // Combine API properties with static data
    return {
      properties: properties,
      location: staticData.location,
      searchResults: staticData.searchResults,
      messages: staticData.messages,
      insights: staticData.insights,
      drafts: staticData.drafts || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback data in case of error
    return {
      properties: [],
      location: {
        address: '123 Gandhi Nagar, Guntur, Andhra Pradesh 522003',
        coordinates: { lat: 16.2973, lng: 80.4364 },
        phoneNumber: '+91 39243 22342'
      },
      searchResults: [],
      messages: [],
      insights: {
        overview: [],
        properties: []
      },
      drafts: []
    };
  }
};

// Filter properties based on type
export const filterProperties = (properties: PropertyItem[], filterType: 'all' | 'new' | 'reviewed' | 'draft'): PropertyItem[] => {
  switch (filterType) {
    case 'all':
      return properties.filter(property => !property.isDraft);
    case 'new':
      return properties
        .filter(property => !property.isDraft)
        .sort((a, b) => new Date(b.createdDate || '').getTime() - new Date(a.createdDate || '').getTime());
    case 'reviewed':
      return properties.filter(property => property.isVerified && !property.isDraft);
    case 'draft':
      return properties.filter(property => property.isDraft);
    default:
      return properties.filter(property => !property.isDraft);
  }
};

// Get properties by specific criteria
export const getPropertiesByStatus = (properties: PropertyItem[], status: 'High' | 'Medium' | 'Low'): PropertyItem[] => {
  return properties.filter(property => property.status === status);
};

// Search properties by various criteria
export const searchProperties = (properties: PropertyItem[], query: string, field?: 'owner' | 'location' | 'phone'): PropertyItem[] => {
  if (!query) return properties;
  
  const searchQuery = query.toLowerCase();
  
  return properties.filter(property => {
    switch (field) {
      case 'location':
        return property.address.toLowerCase().includes(searchQuery);
      case 'phone':
        return property.phoneNumber?.toLowerCase().includes(searchQuery);
      case 'owner':
        // In a real app, you'd have owner name field
        return property.description.toLowerCase().includes(searchQuery);
      default:
        // Search all fields
        return (
          property.address.toLowerCase().includes(searchQuery) ||
          property.description.toLowerCase().includes(searchQuery) ||
          property.phoneNumber?.toLowerCase().includes(searchQuery) ||
          property.id.toLowerCase().includes(searchQuery)
        );
    }
  });
};