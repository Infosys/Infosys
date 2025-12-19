// This file defines the SearchBar component, which provides a filter dropdown, search input, and sort dropdown
// for searching and sorting properties in the property search UI.

import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import {
  searchBarContainerSx,
  searchFieldSx,
  iconSx
} from "../../../styles/SearchPropertyHeader/SearchBar/SearchBarStyle";

// Props for the SearchBar component
interface SearchBarProps {
  selectedFilter: string; // Currently selected filter value
  onFilterChange: (filter: string) => void; // Callback when filter changes
  searchValue: string; // Current search input value
  onSearchChange: (value: string) => void; // Callback when search input changes
  selectedSort: string; // Currently selected sort value
  onSortChange: (sort: string) => void; // Callback when sort option changes
}

// Functional component for displaying the search bar with filter, search, and sort controls
const SearchBar: React.FC<SearchBarProps> = ({
  selectedFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  selectedSort,
  onSortChange,
}) => {
  // Handle changes in the search input field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <Box sx={searchBarContainerSx}>
      {/* Dropdown for selecting the filter type */}
      <FilterDropdown
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
      />
      {/* Search input field with search icon */}
      <TextField
        placeholder={`Search by ${selectedFilter}`}
        value={searchValue}
        onChange={handleSearchChange}
        size="small"
        variant="outlined"
        sx={searchFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={iconSx} />
            </InputAdornment>
          ),
          "aria-label": "property search"
        }}
      />
      {/* Dropdown for selecting the sort option */}
      <SortDropdown
        selectedSort={selectedSort}
        onSortChange={onSortChange}
      />
    </Box>
  );
};

export default SearchBar;