import type { SxProps, Theme } from "@mui/material";

export const headerContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  mb: 2,
};

export const headerTitleSx: SxProps<Theme> = {
  fontSize: 32,
  fontWeight: 500,
  color: "black",
};

export const headerSubtitleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 300,
  color: "black",
};