import type { SxProps, Theme } from "@mui/material";

export const mainContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  px:5,
  mt:8,
  height:"100%",
  pb:2,
};

export const contentRowSx: SxProps<Theme> = {
  width:"100%",
};

export const leftColumnSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateRows: "1fr",
  background:"#ffffff",
  px:2,
  py:2,
  borderRadius:"10px",
  gap:3,
  maxHeight: "100vh",
};