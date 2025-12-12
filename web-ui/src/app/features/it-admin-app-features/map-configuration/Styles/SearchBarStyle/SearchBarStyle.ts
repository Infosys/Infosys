import type { SxProps, Theme } from "@mui/material";

export const searchBarContainerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  background: "#ffffff",
  borderRadius: "20px",
  boxShadow: "-8px 8px 12px -4px #00000095", 
  border: "1px solid #E0E0E0",
  height: 36,
  px: 2,
  width: "100%",
  maxWidth: 420,
  opacity: 0.8,
};

export const searchInputSx: SxProps<Theme> = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 18,
  background: "transparent",
  color: "#868686",
  "&::placeholder": {
    color: "#868686",
    opacity: 1,
    fontSize: 18,
    fontStyle: "italic",
  },
};

export const searchIconSx: SxProps<Theme> = {
  color: "#222",
  fontSize: 28,
  ml: 1,
  cursor: "pointer",
};