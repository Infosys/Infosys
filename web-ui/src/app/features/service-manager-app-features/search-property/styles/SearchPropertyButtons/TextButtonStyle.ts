// This file defines the style object for the created date text button
// used in the property search feature for consistent button appearance.

import type { SxProps, Theme } from "@mui/material";

// Styles for the created date button
export const createdDateButtonSx: SxProps<Theme> = {
  width:"100px",
  backgroundColor: "#ffffff",
  color: "black",
  borderRadius: "10px",
  height: "20px",
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  border: "1.5px solid #222",
  boxShadow: "none",
  px: 2,
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#222",
  },
};