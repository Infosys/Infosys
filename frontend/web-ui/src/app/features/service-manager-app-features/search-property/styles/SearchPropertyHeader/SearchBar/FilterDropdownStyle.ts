// This file defines style objects for the filter dropdown button and menu
// used in the property search bar for consistent appearance and behavior.

import type { SxProps, Theme } from "@mui/material";

// Styles for the filter dropdown button
export const filterButtonSx: SxProps<Theme> = {
  borderRadius: "20px",
  backgroundColor: "#a3c7d7",
  color: "#222",
  textTransform: "none",
  fontWeight: 500,
  fontSize: 18,
  padding: "8px 32px",
  minWidth: "180px",
  height: "48px",
  border: "none",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#90b4c6",
  },
};

// Styles for the dropdown menu paper (container)
export const filterMenuPaperSx: SxProps<Theme> = {
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  minWidth: "180px",
  background: "#f7f7f7",
};

// Styles for each menu item in the dropdown
export const filterMenuItemSx: SxProps<Theme> = {
  fontSize: 16,
  color: "#222",
  padding: "10px 24px",
  fontWeight: 400,
  "&:hover": {
    backgroundColor: "#e3e3e3",
    color: "#0b4b66",
  },
};