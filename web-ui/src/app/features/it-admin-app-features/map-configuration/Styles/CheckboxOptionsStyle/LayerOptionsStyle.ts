import type { SxProps, Theme } from "@mui/material";

export const layerOptionsBoxSx: SxProps<Theme> = {
  p: 0,
  width: "100%",
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px"
};

export const layerOptionsCheckboxSx: SxProps<Theme> = {
  color: "#c84c03",
  '&.Mui-checked': {
    color: "#c84c03",
  },
};

export const layerOptionsLabelSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 300,
};

export const layerOptionsDividerSx: SxProps<Theme> = {
  mb: 0,
  background: "#00000033",
  borderBottomWidth: 1,
};