import type { SxProps, Theme } from "@mui/material";

export const actionButtonSx: SxProps<Theme> = {
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#c84c03",
  textTransform: "none",
  fontWeight: 500,
  fontSize: 14,
  padding: "8px 16px",
  minWidth: "90px",
  height: "24px",
  border: "1px solid #c84c03",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#ffffff",
  },
};

export const actionMenuPaperSx: SxProps<Theme> = {
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  minWidth: actionButtonSx.minWidth, 
  background: actionButtonSx.backgroundColor, 
  color: actionButtonSx.color, 
};

export const actionMenuItemSx: SxProps<Theme> = {
  fontSize: actionButtonSx.fontSize as number | string, 
  padding: actionButtonSx.padding as string,
  fontWeight: actionButtonSx.fontWeight as number | string,
  background: "transparent",
  borderRadius: "8px", 
  "&:hover": {
    backgroundColor: "#e3e3e3",
    color: "#c84c03",
  },
};