// This file defines the style object for the sort dropdown button
// used in the property search bar for consistent appearance and behavior.

import type { SxProps, Theme } from "@mui/material";

// Styles for the sort dropdown button
export const sortButtonSx: SxProps<Theme> = {
  borderRadius: "240px",
  border: "1.5px solid #d97b3e",
  backgroundColor: "#fff",
  color: "#222",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "18px",
  padding: "8px 32px",
  minWidth: "160px",
  height: "48px",
  cursor: "pointer",
  boxShadow: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#d97b3e",
  },
};