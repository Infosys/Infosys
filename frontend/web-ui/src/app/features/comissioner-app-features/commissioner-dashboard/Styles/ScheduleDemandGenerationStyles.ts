// This file defines style objects for the ScheduleDemandGeneration component and its UI elements.
// All styles use the MUI SxProps format for easy integration with Material-UI components.
import type { SxProps, Theme } from '@mui/material'

// Style for the outer card container
export const cardContainerStyles: SxProps<Theme> = {
  borderRadius: '12px',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #E5E7EB',
  backgroundColor: '#ffffff',
  padding: '24px',
  width: '100%',
}

// Style for the card title text
export const titleStyles: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: '18px',
  color: '#0B4B66',
  marginBottom: '20px',
  lineHeight: 1.4,
  textAlign: 'center',
}

// Style for the content box (holds search and button)
export const contentBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

// Style for the search text field
// Updated component-specific styles
export const searchFieldStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#D1D5DB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0B4B66',
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '14px',
    color: '#374151',
    '&::placeholder': {
      color: '#9CA3AF',
      opacity: 1,
      fontStyle: 'italic',
    },
  },
}

// Style for the generate button
export const generateButtonStyles: SxProps<Theme> = {
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  padding: '12px 24px',
  minHeight: '44px',
  borderColor: '#0B4B66',
  color: '#0B4B66',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: '#F9FAFB',
    borderColor: '#0B4B66',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}

// Style for the search icon button inside the text field
export const searchIconButtonStyles: SxProps<Theme> = {
  padding: '6px',
  bgcolor: 'transparent',
  color: '#0B4B66',
  '&:hover': { 
    bgcolor: 'rgba(11, 75, 102, 0.04)' 
  },
}