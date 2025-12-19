
/**
 * This component renders a search bar for filtering applications in the inbox.
 * It updates the search value in the Redux store as the user types.
 */
import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  searchBarContainerSx,
  searchFieldSx,
} from "../../styles/ApplicationInboxSearchBar/ApplicationInboxSearchBarStyle";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../store/filterSlice";


// Functional component to render a search bar for the inbox
const ApplicationInboxSearchBar: React.FC = () => {
  const dispatch = useDispatch();
  // Get the current search value from Redux store
  const searchValue = useSelector((state: any) => state.filter.searchValue);

  // Update the search value in the store when the user types
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(event.target.value));
  };

  return (
    <Box sx={searchBarContainerSx}>
      <TextField
        fullWidth
        placeholder="search Application No."
        value={searchValue}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        sx={searchFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "#1c1b1f", cursor: "pointer" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

// Export the ApplicationInboxSearchBar component as default
export default ApplicationInboxSearchBar;