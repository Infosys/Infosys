// ActionButton component for consistent button styling and behavior
// Used throughout the app for primary, secondary, and action buttons with custom styles

import React from 'react'
import { Button } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

// Props for the ActionButton component
interface ActionButtonProps {
  children: React.ReactNode // Button label or content
  onClick?: () => void // Click handler
  variant?: 'contained' | 'outlined' | 'text' // MUI button variant
  fullWidth?: boolean // If true, button takes full width
  disabled?: boolean // If true, button is disabled
  size?: 'small' | 'medium' | 'large' // Button size
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' // Button color
  sx?: SxProps<Theme> // Custom styles
  startIcon?: React.ReactNode // Icon at the start
  endIcon?: React.ReactNode // Icon at the end
  type?: 'button' | 'submit' | 'reset' // Button type
}

// ActionButton functional component
const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'outlined',
  fullWidth = false,
  disabled = false,
  size = 'medium',
  color = 'primary',
  sx,
  startIcon,
  endIcon,
  type = 'button'
}) => {
  // Default and variant-specific styles for the button
  const defaultStyles: SxProps<Theme> = {
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 16px',
    maxHeight: '36px',
    py:1,
    width: fullWidth ? '100%' : '85%',
    // Outlined variant styles
    ...(variant === 'outlined' && {
      borderColor: '#0B4B66',
      color: '#0B4B66',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: '#F9FAFB',
        borderColor: '#0B4B66',
      },
    }),
    // Contained variant styles
    ...(variant === 'contained' && {
      backgroundColor: '#0B4B66',
      color: 'white',
      '&:hover': {
        backgroundColor: '#083A4D',
      },
    }),
    // Disabled state styles
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    ...sx
  }

  // Render the MUI Button with custom styles and props
  return (
    <Button
      variant={variant}
      onClick={onClick}
      fullWidth={false}
      disabled={disabled}
      size={size}
      color={color}
      sx={defaultStyles}
      startIcon={startIcon}
      endIcon={endIcon}
      type={type}
    >
      {children}
    </Button>
  )
}

export default ActionButton