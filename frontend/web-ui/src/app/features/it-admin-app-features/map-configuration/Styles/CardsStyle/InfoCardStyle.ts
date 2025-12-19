import type { SxProps, Theme } from "@mui/material";

export const InfoCardContainerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

export const labelSx: SxProps<Theme> = {
fontSize: 20,
fontWeight: 400,
textAlign: "center",
    width: "100%",
}

export const valueSx: SxProps<Theme> = {
    fontSize: 32,
    fontWeight: 600,
}

export const CardSx: SxProps<Theme> = {
px: 2, 
py:0.4,
minWidth: 200, 
maxWidth: 200, 
width: 200, 
border: "1px solid #000000", 
boxSizing: "border-box" 
}