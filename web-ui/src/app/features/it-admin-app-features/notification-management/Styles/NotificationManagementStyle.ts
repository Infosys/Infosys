import type { SxProps, Theme } from "@mui/material";

export const containerStylesSx: SxProps<Theme> = {
    backgroundColor: "#f5f5f5",
    pl:5,
    pr:2,
    pt:4,
    pb:2,
    height: "100vh",
}

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
  p:0,
  m:0,
};

export const headerSubtitleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 300,
  color: "black",
  p:0,
  m:0,
};

export const ButtonsContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  width: "100%",
  gap: 2,
  mb: 2,
};