import type { SxProps, Theme } from "@mui/material";

export const reassignmentBoxSx: SxProps<Theme> = {
  background: "#ffffff",
  borderRadius: "10px",
  px: 1,
  py: 1,
  height:"auto",
  alignSelf: "flex-start",
};

export const titleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 300,
  letterSpacing: 0.5,
  color: "black",
  mb: 2,
};

export const fieldLabelSx: SxProps<Theme> = {
  fontSize: 16,
  fontWeight: 300,
};

export const agentFieldSx: SxProps<Theme> = {
  background: "#f1f1f1",
  borderRadius: "8px",
  height: "40px",
  width: "100%",
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px", 
    lineHeight: "20px",   
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

export const reasonFieldSx: SxProps<Theme> = {
  background: "#f1f1f1",
  borderRadius: "8px",
  width: "100%",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

export const toggleRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  mt: 1,
  mb: 2,
};