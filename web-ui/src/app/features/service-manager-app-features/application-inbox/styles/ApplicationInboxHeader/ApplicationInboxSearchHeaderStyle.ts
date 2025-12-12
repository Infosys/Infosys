import type { SxProps, Theme } from "@mui/material";

export const searchHeaderContainerSx: SxProps<Theme> = {
  background: "rgba(217, 217, 217, 0.31)",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  px: 2,
  py: 2,
  pb: 3,
  width: "100%",
};

export const selectPropertiesTextSx: SxProps<Theme> = {
  ml: 2,
  fontSize: 20,
  fontWeight: 300,
};

export const searchHeaderRowSx: SxProps<Theme> = {
  mt: 1,
  ml: 2,
  display: "grid",
  gridTemplateColumns:"6fr 1fr",
  alignItems:"center",
  gap:2,
};