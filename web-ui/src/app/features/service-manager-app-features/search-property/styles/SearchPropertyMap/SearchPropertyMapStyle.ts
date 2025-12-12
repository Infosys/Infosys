// This file defines style objects for the map component, wrapper, map div, and overlay
// used to style the interactive/static map in the property search feature.

export const mapComponentOuterStyle = {
  width: '100%',
  height: '262px',
  minHeight: '262px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden',
  margin: '20px 0',
  display: 'flex',
  flexDirection: 'column' as const
};

// Styles for the map wrapper container
export const mapWrapperContainerStyle = {
  position: 'relative' as const,
  width: '100%',
  height: '100%',
  minHeight: '262px',
  flex: 1
};

// Styles for the map div (Leaflet map container)
export const mapDivStyle = {
  width: '100%',
  height: '100%',
  minHeight: '262px',
  zIndex: 1,
  '& .leaflet-container': {
    height: '100%',
    width: '100%'
  }
};

// Styles for the overlay that toggles map interactivity
export const mapOverlayStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  zIndex: 1000
};