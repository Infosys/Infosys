
// Style definitions for the MapComponent and its sub-elements
import type { SxProps, Theme } from "@mui/material";


// Outer container for the map component
export const mapComponentOuterStyle: SxProps<Theme> = {
  height: 340, // Fixed height
  borderRadius: 2, // Rounded corners
  my: 1, // Vertical margin
  border: '1px solid #000', // Black border
  p: 0, // No padding
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: '#fff', // White background
  overflow: 'hidden',
  width: '70%', // 70% width of parent
};


// Wrapper for the map, ensures full size and background
export const mapWrapperContainerStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  borderRadius: 1, // Slightly rounded corners
  background: '#fff',
  position: 'relative',
  minHeight: 340, // Minimum height for map
};


// Style for the actual map div (Leaflet container)
export const mapDivStyle: SxProps<Theme> = {
  height: '100%',
  width: '100%',
  borderRadius: 1, // Slightly rounded corners
  overflow: 'hidden', // Hide overflow for map tiles
  minHeight: 340,
};


// Overlay to disable map interaction until clicked
export const mapOverlayStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 20, // Above map
  background: 'rgba(255,255,255,0)', // Transparent
  cursor: 'pointer', // Show pointer cursor
};


// Panel for map control buttons (bottom right corner)
export const mapButtonPanelStyle: SxProps<Theme> = {
  position: 'absolute',
  right: 14,
  bottom: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px', // Space between buttons
  zIndex: 1000, // Above map but below overlay
};


// Style for individual map control buttons
export const mapButtonStyle: SxProps<Theme> = {
  background: '#fff', // White background
  border: '1px solid #f1a37c', // Orange border
  color: '#c75b2f', // Orange text
  px: 1.5, // Horizontal padding
  py: 0.5, // Vertical padding
  borderRadius: '6px', // Rounded corners
  fontSize: '0.85rem', // Small font
  cursor: 'pointer',
  minWidth: 0,
  boxShadow: 'none',
  '&:hover': {
    background: '#fff5f0', // Light orange on hover
    borderColor: '#d67645',
    color: '#c75b2f',
  },
  zIndex: 1001, // Above panel
};