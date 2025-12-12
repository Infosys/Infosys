// Represents location information for a property or event
export type LocationData = {
  address: string; // Full address as a string
  coordinates: {
    lat: number; // Latitude value
    lng: number; // Longitude value
  };
  timestamp: string; // Timestamp when the location was recorded
}