
// This file defines style objects for the selector tabs component in the application view, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific tab or tab panel UI element.
import type { SxProps, Theme } from "@mui/material";

// Styles for the pill-shaped tab bar wrapper
export const tabBarWrapperStyle: SxProps<Theme> = {
  display: 'flex',
  padding: '2px',
  px:'4px',
  m: '18px 0 12px 0',
  alignItems: 'start',
  justifyContent: 'space-between',
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
  border: '1px solid #f1f5f9',
};

// Styles for each tab button, with dynamic styling for active and disabled states
export const tabButtonStyle = (active: boolean, disabled: boolean): SxProps<Theme> => ({
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: 14,
  color: disabled
    ? '#bcbcbc'
    : active
      ? '#054e58'
      : '#6b7280',
  fontWeight: active ? 700 : 500,
  bgcolor: active ? '#dff6f9' : 'transparent',
  borderRadius: '10px',
  transition: 'background-color 120ms ease, color 120ms ease, 120ms ease',
  '&:focus': {
    outlineOffset: 1,
  },
});

// Styles for the content panel shown when a tab is active
export const tabPanelStyle: SxProps<Theme> = {
  px: 0,
  pb: 2,
};