// This file defines the SearchPropertyHeader component, which displays the title, subtitle,
// and the search bar for searching and filtering properties in the UI.

import { Box, Typography } from "@mui/material";
import SearchBar from "./SearchBar/SearchBar";
import React from "react";
import {
  containerSx,
  titleSx,
  subtitleSx,
} from "../../styles/SearchPropertyHeader/SearchPropertyHeaderStyle";

// Props for the SearchPropertyHeader component
interface Props {
  selectedFilter: string; // Currently selected filter value
  onFilterChange: (filter: string) => void; // Callback when filter changes
  searchValue: string; // Current search input value
  onSearchChange: (text: string) => void; // Callback when search input changes
  selectedSort: string; // Currently selected sort value
  onSortChange: (sort: string) => void; // Callback when sort option changes
}

// Functional component for displaying the property search header with title, subtitle, and search bar
const SearchPropertyHeader: React.FC<Props> = ({
  selectedFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  selectedSort,
  onSortChange,
}) => {
  return (
    <Box sx={containerSx}>
      {/* Main title for the property search section */}
      <Typography sx={titleSx}>Search Property</Typography>
      {/* Subtitle for additional context */}
      <Typography sx={subtitleSx}>Search and filter properties</Typography>
      {/* Spacer for layout */}
      <Box sx={{ height: 16 }} />
      {/* Search bar with filter, search, and sort controls */}
      <SearchBar
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        selectedSort={selectedSort}
        onSortChange={onSortChange}
      />
    </Box>
  );
};

export default SearchPropertyHeader;