// Style object for pagination controls in the UI
// Customizes the appearance of pagination items and selected state

import type { SxProps, Theme } from "@mui/material";

// Style for the pagination component and its items
export const paginationStyleSx: SxProps<Theme> = {
  "& .MuiPaginationItem-root": {
    color: "#c84c03",
    borderColor: "#c84c03",
    "&:hover": {
      backgroundColor: "rgba(200, 76, 3, 0.08)", 
      color: "#c84c03",
    },
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    backgroundColor: "#c84c03",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#a23c02", 
      color: "#fff",
    },
  },
  "& .Mui-selected": {
    backgroundColor: "#c84c03",
    color: "#fff",
  },
}