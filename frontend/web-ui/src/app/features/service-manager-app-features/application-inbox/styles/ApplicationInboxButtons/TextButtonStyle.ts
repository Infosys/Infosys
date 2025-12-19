import type { SxProps, Theme } from "@mui/material";

export const newPropertyButtonSx: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  color: "#c84c03",
  borderRadius: "30px",
  height: "20px",
  fontSize: 10,
  fontWeight: 400,
  textTransform: "none",
  border: "1.5px solid #c84c03",
  boxShadow: "none",
  px: 2,
  py: 1,
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#c84c03",
  },
};

const basePriorityButtonSx: SxProps<Theme> = {
  minWidth:"unset",
  width:"auto",
  color: "#ffffff",
  borderRadius: "10px",
  height: "20px",
  fontSize: 10,
  fontWeight: 400,
  textTransform: "none",
  boxShadow: "none",
  border:"none",
  px: 1,
  py: 0,
};

export const highPriorityButtonSx: SxProps<Theme> = {
  ...basePriorityButtonSx,
  backgroundColor: "rgba(163, 2, 2, 0.8)",
  "&:hover": {
    backgroundColor: "#a30202",
    borderColor: "#a30202",
  },
};

export const mediumPriorityButtonSx: SxProps<Theme> = {
  ...basePriorityButtonSx,
  backgroundColor: "rgba(165, 148, 0, 1)",
  "&:hover": {
    backgroundColor: "#a59400",
    borderColor: "#a59400",
  },
};

export const lowPriorityButtonSx: SxProps<Theme> = {
  ...basePriorityButtonSx,
  backgroundColor: "rgba(0, 112, 60, 1)",
  "&:hover": {
    backgroundColor: "#00703c",
    borderColor: "#00703c",
  },
};

export const dueDateButtonSx: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  color: "black",
  borderRadius: "10px",
  height: "20px",
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  border: "1.5px solid #222",
  boxShadow: "none",
  px: 2,
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#222",
  },
};

export const applyFilterButtonSx: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  color: "#c84c03",
  borderRadius: "10px",
  height: "28px",
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  border: "1.5px solid #c84c03",
  boxShadow: "none",
  px: 2,
  alignSelf:"end",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#c84c03",
  },
};