// This file defines style objects for the main search property container and spacer
// used to style the layout of the property search page.

import type { SxProps, Theme } from "@mui/material";

// Styles for the main container of the property search page
export const searchPropertyContainerSx: SxProps<Theme> = {
  px:5,
  mt:8,
  // width:"100%",
  background:"#E5E5E5",
};

// Styles for the spacer box used for vertical spacing
export const searchPropertySpacerSx: SxProps<Theme> = {
  my: 5,
};