// Style objects for GenerateDemandPopUp component and related dialog UI elements
// These styles control the appearance of the demand generation popup dialog and its buttons

import type { SxProps, Theme } from "@mui/material";

// Style for the main dialog container
export const dialogStyles: SxProps<Theme> = {
  borderRadius: "12px",
};

// Style for the box containing the dialog title and description
export const dialogTitleBoxStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

// Style for the 'Generate Demand' button
export const generateButtonStyles: SxProps<Theme> = {
  backgroundColor: "#0b4b66",
  color: "white",
  borderRadius: "8px",
  minWidth: 120,
  padding: "6px 16px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#083a4d",
  },
};

// Style for the 'Cancel action' button
export const cancelButtonStyles: SxProps<Theme> = {
  color: "#c84c03",
  borderColor: "#c84c03",
  borderRadius: "8px",
  minWidth: 120,
  padding: "6px 16px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "rgba(200, 76, 3, 0.08)",
    borderColor: "#c84c03",
  },
};

// Style for the actions section at the bottom of the dialog
export const dialogActionsStyles: SxProps<Theme> = {
  justifyContent: "center",
  gap: 2,
  pb: 2,
};