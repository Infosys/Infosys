import type { SxProps, Theme } from "@mui/material";

export const fileUploadBoxSx = (dragActive: boolean): SxProps<Theme> => ({
  border: "2px dashed #ccc",
  minHeight: 150,
  borderRadius: 2,
  py: 4,
  textAlign: "center",
  bgcolor: dragActive ? "#ffe5d1" : "#fafafa",
  cursor: "pointer",
  width: "100%",
  mx: "auto",
  transition: "background-color 0.2s",
});

export const uploadIconSx: SxProps<Theme> = {
  fontSize: 40,
  mb: 2,
  color: "#c84c03",
};

export const browseButtonSx: SxProps<Theme> = {
  color: "#c84c03",
  fontWeight: 600,
  textTransform: "none",
  p: 0,
};