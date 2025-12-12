import type { SxProps, Theme } from "@mui/material";

export const applicationInboxPropertyCardSx: SxProps<Theme> = {
    display: "grid",
    // gridTemplateColumns: "auto auto 1fr",
    // px: 2,
    gridTemplateColumns: "auto auto",
    gap: 2,
    width: "100%",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "10px",
    px: 5,
    py: 2,
}

export const propertyCardHeaderSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
};

export const propertyCardAgentInfoSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
};

export const propertyCardActionsSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  height: "100%",
};