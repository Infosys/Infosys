// SearchField component for entering and triggering search queries
// Used in dashboards and lists to filter or search data by user input

import React from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { SxProps, Theme } from '@mui/material'
import { searchFieldStyles,  searchIconButtonStyles} from '../../Styles/SearchFieldStyle/searchFieldStyle'

// Props for the SearchField component
interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  fullWidth?: boolean
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
  disabled?: boolean
  variant?: 'outlined' | 'filled' | 'standard'
}

// SearchField functional component
const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  fullWidth = true,
  size = "small",
  sx,
  disabled = false,
  variant = "outlined"
}) => {
  // Handle input value change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    onChange?.(newValue)
  }

  // Trigger search action
  const handleSearch = () => {
    onSearch?.(value)
  }

  // Trigger search on Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // Combine default and custom styles
  const sxProp = Array.isArray(sx)
    ? [searchFieldStyles, ...sx]
    : sx
      ? [searchFieldStyles, sx]
      : searchFieldStyles

  // Render the search input field with search icon button
  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      variant={variant}
      size={size}
      disabled={disabled}
      sx={sxProp}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              size="small"
              onClick={handleSearch}
              disabled={disabled}
              sx={searchIconButtonStyles}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchField