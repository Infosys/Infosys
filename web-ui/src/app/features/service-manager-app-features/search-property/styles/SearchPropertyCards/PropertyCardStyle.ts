// This file defines style objects for the property card and its subcomponents
// used to style the property card UI in the property search feature.

import type { SxProps, Theme } from "@mui/material";

// Styles for the main property card container
export const cardBoxSx: SxProps<Theme> = {
  position: "relative",
  background: "#f5f5f5",
  borderRadius: "20px",
  border: "1px solid rgba(0,0,0,0.2)",
  px: 3,
  py: 2,
  // minHeight: 170,
  display: "grid",
  gridTemplateColumns: "auto 1fr 1fr",
};

// Styles for the details section of the card
export const detailsBoxSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  ml: 2,
};

// Styles for the title row (property name and status)
export const titleRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 0,
  pb: 0,
};

// Styles for the article icon on the card
export const articleIconSx: SxProps<Theme> = {
  fontSize: 28,
  color: "black",
  mr: 0.5,
  pb: 0,
};

// Styles for the property name text
export const propertyNameSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 600,
  color: "rgba(0, 0, 0, 0.6)",
};

// Styles for the property ID text
export const propertyIdSx: SxProps<Theme> = {
  fontSize: 16,
  color: "rgba(0, 0, 0)",
  mb: 0.5,
  fontWeight: 300,
  pt: 0,
};

// Styles for the address text
export const addressSx: SxProps<Theme> = {
  fontSize: 14,
  color: "rgba(0, 0, 0)",
  fontWeight: 500,
  mb: 0,
};

// Styles for the agent button container
export const agentButtonBoxSx: SxProps<Theme> = {
  mt: 0.5,
};

// Styles for each image/document preview item
export const imageItemSx: SxProps<Theme> = {
  width: 115,
  // height: "75%",
  height: 100,
  background: "rgba(217,217,217,0.2)",
  borderRadius: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

// Styles for the icon shown in image/document preview
export const imageIconSx: SxProps<Theme> = {
  fontSize: 36,
  color: "#888",
};

// Styles for the map preview box
export const mapStyleSx = {
  width: '150px',
  height: '100%',
  borderRadius: '8px',
};

// Styles for the date text
export const dateStyleSx = {
  p:0,
  m:0,
  fontSize:12,
  fontWeight:400,
}

// Styles for the images/documents container
export const imagesBoxSx: SxProps<Theme> = {
  display:"flex", 
  flexDirection:"row", 
  alignItems:"end", 
  justifyContent:"flex-end", 
  gap:2
};

// Styles for the status text/button
export const statusTextSx: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  color: "#c84c03",
  borderRadius: "30px",
  height: "15px",
  fontSize: 10,
  fontWeight: 400,
  textTransform: "none",
  border: "1.5px solid #c84c03",
  boxShadow: "none",
  px: 2,
  py: 1,
  mb:0.5,
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#c84c03",
  },
}