import type { SxProps, Theme } from "@mui/material";

export const toggleButtonSx: SxProps<Theme> = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#0b4b66",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#0b4b66",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#b0bec5",
  },
};