// This file defines style objects for the ViewLocationButton and its icon
// used in the property search feature for consistent button appearance.

import type { SxProps, Theme } from "@mui/material";

// Styles for the View Location button
export const viewLocationButtonSx: SxProps<Theme> = {
  background: "#FBEEE8",
  color: "#222",
  fontWeight: 500,
  fontSize: 15,
  borderRadius: "10px",
  border: "none",
  px: 2,
  py: 0.5,
  textTransform: "none",
  boxShadow: "none",
  minWidth: 0,
};

// Styles for the icon inside the View Location button
export const viewLocationIconSx: SxProps<Theme> = {
  fontSize: 18,
};