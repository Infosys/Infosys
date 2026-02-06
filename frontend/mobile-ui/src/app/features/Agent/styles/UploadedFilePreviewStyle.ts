import type { SxProps, Theme } from "@mui/material";

export const uploadFilePreviewContainerSx: SxProps<Theme> = {
  border: "1px solid #eee",
  borderRadius: 2,
  p: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 2,
  bgcolor: "#fafafa",
  boxShadow: 1,
  position: "relative",
  minWidth: 280,
  width: "100%",
};

export const fileInfoBoxSx: SxProps<Theme> = {
  py: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "relative",
  gap: 2,
};

export const fileIconSx = {
  width: 32,
  height: 32,
};

export const fileNameSx: SxProps<Theme> = {
  fontSize: 15,
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block",
};

export const closeButtonSx: SxProps<Theme> = {
  position: "absolute",
  top: 6,
  right: 6,
};

export const downloadButtonBoxSx: SxProps<Theme> = {
  width: "100%",
};

export const downloadButtonSx: SxProps<Theme> = {
  color: "#c84c03",
  borderColor: "#c84c03",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: 2,
  "&:hover": {
    backgroundColor: "#c84c0310",
    borderColor: "#c84c03",
  },
};