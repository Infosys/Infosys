
// This file defines style objects for the Add Request popup component using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific UI element in the popup dialog.
import type { SxProps, Theme } from "@mui/material";

// Styles for the main dialog paper (container) of the popup
export const dialogPaperStyle: SxProps<Theme> = {
  borderRadius: "22px",
  p: 0,
  minWidth: 420,
  maxWidth: 510,
  boxShadow: "0px 6px 24px 0px rgba(36,66,117,0.16)",
};

// Styles for the title text of the dialog
export const dialogTitleStyle: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "22px",
  mt: 3,
  mb: 1.5,
  textAlign: "center",
  color: "#121212",
};

// Styles for the close (X) button in the dialog
export const closeButtonStyle: SxProps<Theme> = {
  position: "absolute",
  top: 14,
  right: 14,
  bgcolor: "#F3F8FA",
  color: "#0B4B66",
  width: 36,
  height: 36,
  borderRadius: "50%",
  minWidth: 0,
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#ebf3fa",
  },
};

// Styles for form field labels in the popup
export const labelStyle: SxProps<Theme> = {
  fontWeight: 500,
  color: "#152024",
  fontSize: "15px",
  mb: "6px",
};
// Styles for the content area or text fields in the popup
export const contentStyle: SxProps<Theme> = {
  fontWeight: 300,
  border:   '1px solid #E0E6ED',
  p:1,
  color: "#152024",
  fontSize: "15px",
  borderRadius: "8px",
  mb: "6px",
};

// Styles for the main text input fields
export const textFieldStyle: SxProps<Theme> = {
  width: "100%",
  bgcolor: "#F8FAFB",
  borderRadius: "10px",
  mb: 2.5,
  textarea: { minHeight: 86, maxHeight: 120 },
};

// Styles for the file input dropzone area
export const fileInputRoot: SxProps<Theme> = {
  bgcolor: "#F8FAFB",
  border: "1.5px dashed #DBDFE6",
  borderRadius: "8px",
  p: "25px 0",
  mb: 2.2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  minHeight: 80,
  cursor: "pointer",
};

// Styles for the container displaying uploaded files
export const uploadedFileStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mt: 1,
  mb: 2,
  px: 2,
  py: 1,
  borderRadius: "8px",
  bgcolor: "#F9FEFC",
  border: "1px solid #CEF4ED",
};

// Styles for the download button for uploaded files
export const downloadBtnStyle: SxProps<Theme> = {
  color: "#0B4B66",
  bgcolor: "transparent",
  borderRadius: "8px",
  px: 1.5,
  py: "4px",
  fontWeight: 500,
  fontSize: "14px",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#EAFEFB",
  },
};

// Styles for the button bar at the bottom of the popup
export const buttonBarStyle: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  justifyContent: "flex-end",
  gap: 1.5,
  mt: 3,
  mb: 2,
};

// Styles for the cancel button in the popup
export const cancelBtnStyle: SxProps<Theme> = {
  color: "#0B4B66",
  bgcolor: "#F8FAFB",
  borderRadius: "8px",
  width: 104,
  height: 36,
  fontWeight: 600,
  fontSize: "15px",
  textTransform: "none",
  boxShadow: "none",
  border: "1px solid #E0E6ED",
  "&:hover": {
    bgcolor: "#E9F0F5",
  },
};

// Styles for the submit button in the popup
export const submitBtnStyle: SxProps<Theme> = {
  color: "#fff",
  bgcolor: "#0B4B66",
  borderRadius: "8px",
  width: 104,
  height: 36,
  fontWeight: 600,
  fontSize: "15px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#09374b",
  },
};