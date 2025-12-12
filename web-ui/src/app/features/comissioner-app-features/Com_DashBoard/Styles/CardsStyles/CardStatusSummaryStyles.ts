// Style objects for CardStatusSummary component and related UI elements
// These styles control the layout, colors, and appearance of status summary cards

import type { SxProps, Theme } from "@mui/material/styles";

// Container style for the entire card
export const cardContainerStyles: SxProps<Theme> = {
  width: "100%",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  p: "0 0 0 0",
  fontFamily: "inherit",
  border: "2px solid #d9d9d9",
  minHeight: 70,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  pb:3,
};

// Style for the header row containing ward/zone and status summary
export const cardHeaderRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  pt: 2,
};

// Style for the ward/zone label text
export const wardZoneTextStyles: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: 18,
  color: "#222",
  flex: 1,
  textAlign: "left",
};

// Style for the row containing all status items (pending, approved, rejected, avg time)
export const statusRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  gap: "40px",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 2,
};

// Base style for each status item (pending, approved, rejected)
export const statusItemStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 60,
};

// Text color for pending status
export const pendingStyles: SxProps<Theme> = {
  color: "#b91900",
};

// Text color for approved status
export const approvedStyles: SxProps<Theme> = {
  color: "#00703c",
};

// Text color for rejected status
export const rejectedStyles: SxProps<Theme> = {
  color: "#c84c03",
};

// Style for the divider line at the bottom of the card
export const dividerStyles: SxProps<Theme> = {
  mt: "12px",
  height: "2px",
  width: "98%",
  background: "linear-gradient(to right, #c84c03 95%, #e0e0e0 5%)",
  borderRadius: "1px",
  ml: "1%",
};