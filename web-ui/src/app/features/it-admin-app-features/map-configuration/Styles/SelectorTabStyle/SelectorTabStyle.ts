import type {SxProps, Theme} from "@mui/material";

export const selectorTabSx: SxProps<Theme> = {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap:3,
    alignItems: "center",
    py:0.4,
    px:3,
}

export const singleTabSx: SxProps<Theme> = {
    backgroundColor: "#ffffff",
    cursor: "pointer",
    px: 1,
    borderRadius: "10px",
}

export const selectedSingelTabSx: SxProps<Theme> = {
    ...singleTabSx,
    backgroundColor: "#f7e4db",
}