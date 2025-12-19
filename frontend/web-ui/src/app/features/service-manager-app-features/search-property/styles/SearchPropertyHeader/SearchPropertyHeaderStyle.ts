// This file defines style objects for the search property header container, title, and subtitle
// used in the property search UI for consistent layout and typography.

import type { SxProps, Theme } from "@mui/material";

// Styles for the main container of the search property header
export const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  flex: 1,
};

// Styles for the main title text
export const titleSx: SxProps<Theme> = {
  fontSize: "32px",
  fontWeight: 500,
  color: "black",
};

// Styles for the subtitle text
export const subtitleSx: SxProps<Theme> = {
  fontSize: "20px",
  fontWeight: 300,
  color: "black",
};