import type { SxProps, Theme } from "@mui/material";

export const searchBarContainerSx: SxProps<Theme> = {
  width: "100%",
};

export const searchFieldSx: SxProps<Theme> = {
  borderRadius: "10px",
  background: "#fafafa",
  fontSize: 20,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fafafa",
    height: 40,
    borderColor: "#b0b0b0",
  },
  "& .MuiOutlinedInput-input": {
    fontSize: 20,
    padding: "10px 16px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#b0b0b0",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "#c84c03",
},
};