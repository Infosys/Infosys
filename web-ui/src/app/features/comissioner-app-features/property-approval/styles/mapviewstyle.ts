
// Style definitions for the map view and search panel in property approval
import type { CSSProperties } from 'react'


// Main container for the map and side panel
export const containerStyle: CSSProperties = {
  display: 'flex', // Flex layout for map and panel
  gap: 10, // Space between map and panel
  width: '100%',
  height: '100vh', // Full viewport height
  boxSizing: 'border-box',
  overflow: 'hidden',   
  position: 'relative',
}


// Wrapper for the map area (fills container)
export const mapWrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  flex: 1, // Take up available space
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0, // Important for scrolling flex children
  overflow: 'hidden',
}


// Style for the floating search/info panel
export const panelStyle: CSSProperties = {
  width: 327, // Fixed width
  // Constrain height so panel doesn't force page scroll
  maxHeight: 'calc(100% - 24px)',
  position: 'absolute',
  right: 24,
  top: 15,
  overflow: 'hidden',
  padding: 12,
  background: '#f7f7f7', // Light gray background
  zIndex: 1000,
  borderRadius: 20, // Rounded corners
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // Subtle shadow
}


// Container for the search form
export const searchFormContainerStyle: CSSProperties = {
  marginBottom: 14,
}


// Wrapper for the search input (pill style)
export const searchInputWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#fff',
  borderRadius: 28, // Pill shape
  padding: '6px 10px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: 340,
}


// Style for the search input element
export const inputStyle: CSSProperties = {
  border: 'none',
  outline: 'none',
  flex: 1,
  fontSize: 14,
  padding: '8px 12px',
  background: 'transparent',
}


// Style for the search hint text
export const searchHintStyle: CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  color: '#666',
}


// Wrapper for the list of zones
export const zoneListWrapStyle: CSSProperties = {
  marginBottom: 12,
}


// Style for the zone list title
export const zoneListTitleStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
}


// Base style for zone selection buttons
export const zoneButtonStyleBase: CSSProperties = {
  textAlign: 'left',
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #eee',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}


// Style for each ward card in the list
export const wardCardStyle: CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: '1px solid #f0e6e2',
  background: '#fff',
  marginBottom: 10,
}


// Row style for metrics (compliance, property count, etc.)
export const metricsRowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
}


// Block style for each metric
export const metricBlockStyle: CSSProperties = {
  flex: 1,
}


// Style for metric label text
export const metricLabelStyle: CSSProperties = {
  fontSize: 12,
  color: '#666',
}


// Style for metric value text
export const metricValueStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
}


// Style for the 'not found' message box
export const notFoundBoxStyle: CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: '1px dashed #eee',
  background: '#fafafa',
  color: '#999',
}


// Style for the clear button in the search panel
export const clearButtonStyle: CSSProperties = {
  padding: '6px 10px',
}

export default {}
