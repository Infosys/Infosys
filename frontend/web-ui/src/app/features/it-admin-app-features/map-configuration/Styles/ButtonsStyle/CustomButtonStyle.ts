import type { SxProps, Theme } from "@mui/material";

export const getCustomButtonSx = (
  variant: "contained" | "outlined" | "text",
  color?: string,
  backgroundColor?: string
): SxProps<Theme> => ({
  color: variant === "outlined" ? color : color,
  backgroundColor: variant === "contained" ? backgroundColor : undefined,
  borderColor: variant === "outlined" ? color : undefined,
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: 1,
  borderRadius: "8px",
  px: 2,
  py: 0.2,
  fontWeight: 500,
});