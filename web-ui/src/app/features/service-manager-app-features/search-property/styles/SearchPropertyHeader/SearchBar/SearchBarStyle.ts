// This file defines style objects for the search bar, search field, and search icon
// used in the property search header for consistent appearance and layout.

import type { SxProps, Theme } from "@mui/material";

// Styles for the search bar container
export const searchBarContainerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
};

// Styles for the search input field
export const searchFieldSx: SxProps<Theme> = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "40px",
    background: "#fafafa",
    fontSize: "22px",
    height: "48px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    paddingLeft: "4px",
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "18px",
    padding: "10px 16px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

// Styles for the search icon
export const iconSx: SxProps<Theme> = {
  color: "#222",
  cursor: "pointer",
  fontSize: 24,
};