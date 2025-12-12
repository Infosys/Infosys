// This file defines style objects for the AgentButton and its icon
// used in the property search feature for consistent appearance.

import type { SxProps, Theme } from "@mui/material";

// Styles for the AgentButton component
export const agentButtonSx: SxProps<Theme> = {
  background: "#FBEEE8",
  color: "#222",
  fontWeight: 500,
  fontSize: 12,
  borderRadius: "10px",
  px: 2,
  py: 0.5,
  textTransform: "none",
  boxShadow: "none",
  minWidth: 0,
  border: "1px solid black",
};

// Styles for the agent icon inside the button
export const agentIconSx: SxProps<Theme> = {
  fontSize: 20,
};