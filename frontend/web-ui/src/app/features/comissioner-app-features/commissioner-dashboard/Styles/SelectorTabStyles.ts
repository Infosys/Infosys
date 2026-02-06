// This file defines style objects for the SelectorTab component and its tab buttons.
// All styles use the MUI SxProps format for easy integration with Material-UI components.
import type { SxProps, Theme } from '@mui/material'

// Style for the tab container (row of tabs)
export const tabContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  padding: '0',
  width: 'fit-content',
  height: 28,
}

// Style for each tab button, with active/inactive state
export const tabButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  backgroundColor: isActive ? '#0B4B66' : 'transparent',
  color: isActive ? '#FFFFFF' : '#0B4B66',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: isActive ? '#0A4A6E' : '#E2E8F0',
  },
})