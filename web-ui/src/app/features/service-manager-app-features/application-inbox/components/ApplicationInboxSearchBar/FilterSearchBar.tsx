
/**
 * This component renders a search input field with a search icon for filtering.
 * It manages its own local search value state and updates as the user types.
 */
import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchInputSx } from '../../styles/ApplicationInboxSearchBar/FilterSearchBarStyle';


// Functional component to render a search input with a search icon
const ApplicationInboxSearchInput: React.FC = () => {
  // Local state for the search input value
  const [searchValue, setSearchValue] = useState('');

  // Update the local search value as the user types
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <TextField
      fullWidth
      placeholder=""
      value={searchValue}
      onChange={handleSearchChange}
      sx={searchInputSx}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#757575' }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};


// Export the ApplicationInboxSearchInput component as default
export default ApplicationInboxSearchInput;