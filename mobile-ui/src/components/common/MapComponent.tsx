// MapComponent.tsx
// Renders a map section with Chrome-style tabs for switching between map and land use views.
// Integrates LeafletMap and ChromeTabs, and supports property markers.
import React, { useState } from 'react';
import LeafletMap from './Map';
import type { PropertyLocation } from '../../types';
import './MapComponent.css';
import ChromeTabs from '../Agent/ChromeTabs';

// Props for MapComponent
interface MapComponentProps {
  className?: string;
  properties?: PropertyLocation[];
}

/**
 * MapComponent
 * Renders ChromeTabs for switching between map and land use views, and displays the corresponding LeafletMap.
 * Passes property markers to the map.
 */
const MapComponent: React.FC<MapComponentProps> = ({ className = '', properties = [] }) => {
  // State for selected tab (0 = map, 1 = land use)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Handler for tab change
  const handleTabChange = (idx: number) => {
    setSelectedTabIndex(idx);
  };

  return (
    <div className={`map-component ${className}`}  >
      {/* ChromeTabs with Map and Land Use options */}
      <ChromeTabs
        selected={selectedTabIndex}
        onTabChange={handleTabChange}
      />

      {/* Map Frame - shows map based on selectedTabIndex */}
      <div className="map-container-1" >
        {/* Show standard map if tab 0, land use map if tab 1 */}
        {selectedTabIndex === 0 && (
          <LeafletMap properties={properties} />
        )}
        {selectedTabIndex === 1 && (
          <LeafletMap landUse properties={properties} />
        )}
      </div>
    </div>
  );
};

// Export MapComponent as default
export default MapComponent;