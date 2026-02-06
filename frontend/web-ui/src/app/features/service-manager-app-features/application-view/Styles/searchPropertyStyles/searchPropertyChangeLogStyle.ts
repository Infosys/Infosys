
// This file defines style objects for the property change log/history view in the application, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific UI element in the change log/history section.
import type { SxProps, Theme } from "@mui/material";

// Styles for the main container holding the application history and preview
export const applicatonHistoryStyle: SxProps<Theme> = {
  display: "flex",
  gap: "24px",
  width: "100%",
  mt: 0,
};

// Styles for the preview card box (e.g., document/image preview)
export const previewBoxCardStyle: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 250,
  minHeight: 280,
  p: 6,
  borderRadius: 2,
  bgcolor: "#fff",
  border: "2px dashed #888888ff",
};

// Styles for centering content inside the preview box
export const previewCenteredStyle: SxProps<Theme> = {
  textAlign: "center",
};

// Styles for the icon displayed in the preview box
export const previewIconStyle: SxProps<Theme> = {
  fontSize: 32,
};

// Styles for the subtitle or description in the preview box
export const previewSubStyle: SxProps<Theme> = {
  color: "#888",
  fontSize: 14,
};

// Styles for the card displaying the application history log
export const applicationHistoryCardStyle: SxProps<Theme> = {
  flex: 2,
  bgcolor: "#fff",
  p: 2,
  borderRadius: 2,
  boxShadow: "0 1px 8px rgba(0,0,0,.03)",
  border: "1px solid #ececec",
};

// Styles for the title of the application history section
export const applicationHistoryTitleStyle: SxProps<Theme> = {
  mb: 0.5,
};

// Styles for the subtitle or description in the history section
export const historySubStyle: SxProps<Theme> = {
  color: "#6b7280",
  fontSize: 13,
  mb: 1.5,
};

// Styles for each item/row in the history log
export const historyItemStyle: SxProps<Theme> = {
  display: "flex",
  position: "relative",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "1px solid #eee",
  py: 1.5,
  gap: 2,
  width: '100%'
};

// Styles for the left section of a history item (main content)
export const historyLeftStyle: SxProps<Theme> = {
  display: "flex",
  borderBottom: "1px solid #eee",
  p: 1.5,
  m: 1.5,
  width: '100%',
  borderRadius: 2,
  border: "2px solid rgba(0, 0, 0, 0.18)",
  background: "rgba(255, 255, 255, 0.45)",
  boxShadow: "0 4px 30px rgba(0,0,0,0.04)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  // Remove height and minHeight!
};

// Styles for the year or main label in the history item
export const historyYearStyle: SxProps<Theme> = {
  fontWeight: "bold",
  color: "#8d8b8aff",
  minWidth: 48,
  fontSize: 18,
};

// Styles for the main content column in a history item
export const historyMainStyle: SxProps<Theme> = {
display: "flex",
  flexDirection: "column",
  gap: "2px",
  // Remove height/minHeight!


};

// Styles for the button to view a location on the map
export const viewLocationButtonStyle: SxProps<Theme> = {

  alignSelf: 'flex-start',       
  mt: '4px',                  
  background: "#DBFAD3",
  color: "black",
  borderRadius: "16px",
  px: 2,
  py: "4px",
  fontSize: 10,
  width: '132px',
  "&:hover": {
    background: "#bdf9b1",
    color: "#000",
  },
};
// Styles for the right section of a history item (actions, dates)
export const historyRightStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  gap: "10px",
  ml: 'auto'
};

// Styles for the date label in a history item
export const historyDateStyle: SxProps<Theme> = {
  fontSize: 13,
  color: "#000000ff",
  borderRadius: "8px",
  border: "1px solid #000000ff",
  px: 0.5,
};

// Styles for the status label (e.g., approved, pending) in a history item
export const historyStayleStyle: SxProps<Theme> = {
  color: "white",
  width: "102px",
  textAlign: "center",
  backgroundColor: "#00703C",
  fontSize: 13,
  borderRadius: "8px",
};

// Styles for the download button in the history section
export const downloadButtonStyle: SxProps<Theme> = {
  position: "absolute", 
  right: "8px", 
  bottom: "10px",
  background: "#ffffffff",
  color: "#f1a37c",
  border: "#f1a37c 1px solid",
  borderRadius: "16px",
  px: 2,
  py: "4px",
  fontSize: 12,
  boxShadow: "none",
  fontWeight: 700,
  "&:hover": {
    background: "#ee8830",
    color: "#ffffff"
  }
};