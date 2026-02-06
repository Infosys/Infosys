// Search bar component with optional filter label for agent search functionality
// Used in the Service Manager Dashboard to search and filter agents

import React from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {
  searchBarStyle,
  inputPropsStyle,
  filterRowStyle,
  filterLabelStyle,
} from "../../styles/AgentSearchBar/AgentSearchBarStyle";


// Props for the SearchBarWithFilter component
interface SearchBarWithFilterProps {
  searchValue: string; // Current value of the search input
  onSearchChange: (value: string) => void; // Handler for search input changes
  filterLabel?: string; // Optional label for the filter row
  _filterValue?: string; // (Unused) Value for the filter chip
  _onFilterRemove?: () => void; // (Unused) Handler to remove the filter
}

// SearchBarWithFilter component definition
export const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({
  searchValue,
  onSearchChange,
  filterLabel = "Filter",
}) => {
  return (
    <Box>
      {/* Search Bar: allows users to type and search for agents */}
      <TextField
        fullWidth
        variant="outlined"
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search Agents"
        sx={searchBarStyle}
        InputProps={{
          sx: inputPropsStyle, // Style for the input root
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "#807b78", fontSize: 24 }} />
            </InputAdornment>
          ),
        }}
        inputProps={{
          style: {
            borderRadius: "24px",
            paddingLeft: "18px",
            background: "transparent",
            fontFamily: "Roboto, sans-serif",
            fontSize: "17px",
            color: "#5b5752",
            fontWeight: 400,
          },
        }}
      />

      {/* Filter Row: displays a filter icon and label */}
      <Box sx={filterRowStyle}>
        <FilterAltOutlinedIcon sx={{ fontSize: 24, color: "#807b78", mr: 0.5 }} />
        <Typography sx={filterLabelStyle}>
          {filterLabel}
        </Typography>
      </Box>
    </Box>
  );
};