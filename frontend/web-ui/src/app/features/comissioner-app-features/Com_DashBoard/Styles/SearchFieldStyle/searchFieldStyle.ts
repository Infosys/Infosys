// Style objects for SearchField component and its search icon button
// These styles control the appearance of the search input and icon in dashboards and lists

import type { SxProps, Theme } from '@mui/material'

// Styles for the search input field
export const searchFieldStyles: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: '#f5f5f5',
      fontSize: '14px',
      height: '40px',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 12px',
      fontSize: '14px',
      color: '#000000',
      fontStyle: 'normal',
      '&::placeholder': {
        color: '#9CA3AF',
        opacity: 1,
        fontStyle: 'italic',
      },
    },
  }

// Styles for the search icon button at the end of the input
export const searchIconButtonStyles: SxProps<Theme> = {
    padding: '4px',
    bgcolor: 'transparent',
    color: '#6B7280',
    '&:hover': { 
      bgcolor: 'transparent',
      color: '#374151'
    },
  }