
// This file defines style objects for the MapComponent and its UI elements in the application view, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific map-related UI element.
import type { SxProps, Theme } from "@mui/material";

// Styles for the outer container of the map component
export const mapComponentOuterStyle: SxProps<Theme> = {
  // height: 350,
  borderRadius: 2, // 12px
  border: '1px solid #000',
  p: 0,
  position: 'relative',
  mt: 2,
  gridColumn: { xs: undefined, md: '1 / span 2' },
  background: '#fff',
  // minHeight: 300, 
  overflow: 'hidden'
};

// Styles for the wrapper container that holds the map
export const mapWrapperContainerStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  borderRadius: 1, // 8px
  background: '#fff',
  position: 'relative',
  // minHeight: 400, // Ensures height for all parents
};

// Styles for the div that directly renders the map
export const mapDivStyle: SxProps<Theme> = {
  height: '350px',
  width: '100%',
  borderRadius: 1,
  overflow: 'hidden',
  // minHeight: 400,
};

// Styles for the overlay that sits on top of the map (e.g., for disabling interaction)
export const mapOverlayStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 20,
  background: 'rgba(255,255,255,0)',
  cursor: 'pointer',
};

// Styles for the panel that holds map action buttons (bottom right corner)
export const mapButtonPanelStyle: SxProps<Theme> = {
  position: 'absolute',
  right: 14,
  bottom: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 1000,
};

// Styles for the main action button(s) on the map
export const mapButtonStyle: SxProps<Theme> = {
  background: '#fff',
  border: '1px solid #f1a37c',
  color: '#c75b2f',
  px: 1.5,
  py: 0,
  paddingTop: 0,
  borderRadius: '20px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  minWidth: 0,
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    background: '#fff5f0',
    borderColor: '#d67645',
    color: '#c75b2f',
  },
  
  zIndex: 1001,
};

// Styles for circular icon buttons on the map (e.g., zoom, undo)
export const mapIconButtonStyle: SxProps<Theme> = {
   // base visual same as mapButtonStyle but circular
  ...mapButtonStyle,
  width: 36,
  height: 36,
  minWidth: 36,
  px: 0,
  py: 0,
  borderRadius: '70%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'none',
  '&:hover': {
    background: '#fff5f0',
    borderColor: '#d67645',
    color: '#c75b2f',
  },
}

// Styles for the undo action button, based on mapIconButtonStyle
export const mapUndoButtonStyle: SxProps<Theme> = {
  ...mapIconButtonStyle,
  // keep the same outer dimensions as other icon buttons so border thickness/shape stays consistent
  width: 36,
  height: 36,
  minWidth: 36,
  // small inner padding tweak
  px: 0.25,
  py: 0.25,
  boxShadow: 'none',
};