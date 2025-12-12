import type { SxProps, Theme } from "@mui/material";

export const getCustomChipSx = (
  color: string = "#222",
  borderColor: string = "#222",
  backgroundColor: string = "#fff"
): SxProps<Theme> => ({
  display: "inline-block",
  border: `1px solid ${borderColor}`,
  borderRadius: "10px",
  px: 0.6,
  py: 0.25,
  fontSize: 14,
  color,
  backgroundColor,
  fontWeight: 400,
  lineHeight: 1.5,
});