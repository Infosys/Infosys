import type { SxProps, Theme } from "@mui/material";

export const filterButtonSx: SxProps<Theme> = {
  borderRadius: "10px",
  textTransform: "none",
  background: "#ffffff",
  color: "#c84c03",
  borderColor: "#c84c03",
  width: 123,
  height: 37,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: 500,
};

export const filterIconSx: SxProps<Theme> = {
  width: 24,
  height: 24,
};

export const DialogBoxSx: SxProps<Theme> = {
  '& .MuiPaper-root': {
    borderRadius: '20px',
    minWidth: 400,
  },
};