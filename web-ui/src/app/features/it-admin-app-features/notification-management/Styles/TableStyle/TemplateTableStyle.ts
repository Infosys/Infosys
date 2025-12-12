import type { SxProps, Theme } from "@mui/material";

export const textWrapSx: SxProps<Theme> = {
  whiteSpace: "normal",
  wordBreak: "break-word",
  maxWidth: 120
};

export const tableContainerSx: SxProps<Theme> = {
  borderRadius: "16px",
  boxShadow: "none",
  border: "1px solid #00000033",
  maxHeight: 360,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c84c03",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-button": {
    display: "none",
    height: 0,
    width: 0,
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#c84c03 transparent",
};

export const chipWrapSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  maxWidth: 120,
  justifyContent: "center",
};