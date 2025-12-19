
// This file defines style objects for the Assignment/Reassignment box UI in the application view, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific UI element in the assignment box.
import type { SxProps, Theme } from "@mui/material";

// Styles for the main container box of the reassignment section
export const reassignmentBoxSx: SxProps<Theme> = {
  background: "#ffffff",
  borderRadius: "10px",
  px: 1,
  py: 1,
  height:"auto",
  alignSelf: "flex-start",
};

// Styles for the title text in the reassignment box
export const titleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 300,
  letterSpacing: 0.5,
  color: "black",
  mb: 2,
};

// Styles for the labels of form fields
export const fieldLabelSx: SxProps<Theme> = {
  fontSize: 16,
  fontWeight: 300,
};

// Styles for the agent selection input field
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

// Styles for the reason input field
export const reasonFieldSx: SxProps<Theme> = {
  background: "#f1f1f1",
  borderRadius: "8px",
  width: "100%",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

// Styles for the row containing toggle switches or actions
export const toggleRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  mt: 1,
  mb: 2,
};