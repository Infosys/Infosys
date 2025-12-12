// ScheduleDemandGeneration component for scheduling property tax demand generation
// Provides a search field and a button to trigger demand generation, with a popup confirmation

import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import SearchField from '../Components/SearchField/SearchField'
import ActionButton from '../Components/Buttons/ActionButton'
import type { SxProps, Theme } from '@mui/material'
import {
  titleStyles as sharedTitleStyles,
  contentBoxStyles
} from '../Styles/ScheduleDemandGenerationStyles'
import GenerateDemandPopup from "../Components/PopUps/GenerateDemandPopUp";

// Props for the ScheduleDemandGeneration component
interface ScheduleDemandGenerationProps {
  title?: string
  searchPlaceholder?: string
  buttonText?: string
  buttonVariant?: 'contained' | 'outlined' | 'text'
  onSearch?: (value: string) => void
  onGenerate?: () => void
  disabled?: boolean
  showSearch?: boolean
  sx?: SxProps<Theme>
  maxWidth?: string | number
}

// ScheduleDemandGeneration functional component
const ScheduleDemandGeneration: React.FC<ScheduleDemandGenerationProps> = ({
  title = "Schedule Demand Generation",
  searchPlaceholder = "Search Jurisdiction",
  buttonText = "Generate",
  buttonVariant = "outlined",
  onSearch,
  disabled = false,
  showSearch = true,
  sx,
  maxWidth = '400px'
}) => {
  // State for search input value
  const [searchValue, setSearchValue] = useState('')
  // State to control popup visibility
  const [popupOpen, setPopupOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  // Handle search submit (e.g., on Enter or search icon click)
  const handleSearchSubmit = (value: string) => {
    onSearch?.(value)
  }

  // Styles for the main container
  const containerStyles: SxProps<Theme> = {
    borderRadius: '12px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB',
    backgroundColor: '#ffffff',
    padding: '24px',
    maxWidth: maxWidth,
    width: '100%',
    ...sx
  }

  // Title styles, with dynamic margin
  const titleStyles: SxProps<Theme> = {
    ...sharedTitleStyles,
    marginBottom: showSearch || buttonText ? '10px' : 0, // reduce gap
  }

  // Content box styles, with reduced gap
  const contentStyles: SxProps<Theme> = {
    ...contentBoxStyles,
    gap: '8px', // reduce gap between search and button
  }

  // Styles for the button container
  const buttonContainerStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  // Render the component UI
  return (
    <Box sx={containerStyles}>
      <Typography sx={titleStyles}>
        {title}
      </Typography>

      <Box sx={contentStyles}>
        {/* Optional search field for jurisdiction */}
        {showSearch && (
          <SearchField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            disabled={disabled}
          />
        )}

        {/* Action button to generate demand, opens popup */}
        {buttonText && (
          <Box sx={buttonContainerStyles}>
            <ActionButton
              variant={buttonVariant}
              onClick={() => setPopupOpen(true)}
              disabled={disabled}
            >
              {buttonText}
            </ActionButton>
            <GenerateDemandPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ScheduleDemandGeneration