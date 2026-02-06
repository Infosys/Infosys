
// This file defines style objects for the confirmation popup component using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific UI element in the confirmation dialog.
import type { SxProps, Theme } from "@mui/material";

// Styles for the main dialog paper (container) of the confirmation popup
export const confirmDialogPaperStyle: SxProps<Theme> = {
  borderRadius: "20px",
  minWidth: 390,
  maxWidth: 410,
};

// Styles for the title text in the confirmation dialog
export const confirmTitleStyle: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "32px",
  textAlign: "center",
  color: "#1C2237",
  letterSpacing: 0.2,
  px: 4,
  textAlignLast:"left"
};

// Styles for the description text in the confirmation dialog
export const confirmDescStyle: SxProps<Theme> = {
  color: "#4F566B",
  fontSize: "15.3px",
  fontWeight: 500,
  lineHeight: 1.44,
  px: 4,
  textAlign: "left",
};

// Styles for the note or additional information text
export const confirmNoteStyle: SxProps<Theme> = {
  color: "#77809A",
  fontSize: "14px",
  fontWeight: 400,
  textAlign: "left",
  px: 4,
  mb: 2,
};

// Styles for the button bar containing action buttons
export const confirmButtonBar: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  gap: 2.3,
  px: 4,
  mb: 4,
};

// Styles for the reject/cancel button
export const rejectBtn: SxProps<Theme> = {
  border: "1.6px solid #0B4B66",
  color: "#0B4B66",
  bgcolor: "#fff",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "15.2px",
  height: "38px",
  width:"50%",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#EBF2FF",
    borderColor: "#0B4B66",
  },
};

// Styles for the confirm/accept button
export const confirmBtn: SxProps<Theme> = {
  border: "1.6px solid #0B4B66",
  bgcolor: "#0B4B66",
  color: "#fff",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "15.2px",
  height: "38px",
  width:"50%",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#082e44",
    borderColor: "#0B4B66",
  },
};

// Styles for the close (X) button in the confirmation dialog
export const closeButtonStyle: SxProps<Theme> = {
  position: "absolute",
  right: 13,
  top: 16,
  bgcolor: "#F3F8FA",
  color: "#0B4B66",
  width: 33,
  height: 33,
  borderRadius: "50%",
  minWidth: 0,
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#ebf3fa",
  },
}; 