// This file defines the style object for the property card list container
// used to style the list of property cards in the property search feature.

import type { SxProps, Theme } from "@mui/material";

// Styles for the property card list container
export const propertyCardListSx: SxProps<Theme> = {
  height: "auto",
  overflowY: "auto",
  background: "#E5E5E5",
  borderRadius: "0",
  py: 0,
  pl: 0,
  pr: 0,
  // mx: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  '&::-webkit-scrollbar': {
    width: '6px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c84c03',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
};