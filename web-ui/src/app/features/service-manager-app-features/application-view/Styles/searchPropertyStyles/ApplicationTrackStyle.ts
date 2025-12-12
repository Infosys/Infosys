// Styles for the main container of the application tracking component
export const containerStyle = (isMobile: boolean) => ({
  width: { xs: "calc(100% - 12px)", sm: "auto" },
  p: isMobile ? "16px 4px 10px 4px" : "16px 4px 10px 4px",
  flex: 1,
  overflow: "hidden",
  mx: "auto",
  borderRadius: "25px",
  mt: isMobile ? "32px" : "0px",
  mb: isMobile ? "8px" : "0px",
  minWidth: 0,
});

// Styles for the circular step indicator in the timeline
export const timelineCircleStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "2px solid #c2c2c2ff",
  background: "#ffffffff",
  color: "#000000ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  zIndex: 1,
};

// Styles for the vertical bar connecting timeline steps
export const timelineVerticalBarStyle = {
  position: "absolute",
  top: "32px",
  left: "50%",
  width: "4px",
  height: "calc(100% - 32px)",
  transform: "translateX(-50%)",
  background: "#d0d0d0",
  borderRadius: "1.5px",
  zIndex: 0,
};

// Styles for the title of a comment or status update
export const commentTitleStyle = {
  fontSize: 14,
  color: "#0B4B66",
  fontWeight: 700,
  mb: "2px",
};

// Styles for the main text of a comment or status update
export const commentTextStyle = {
  fontSize: 13,
  color: "#1a1a1a",
  fontWeight: 400,
  lineHeight: 1.6,
  mb: "2px",
};

// Styles for the container holding file attachments
export const fileBoxStyle = {
  mt: "14px",
};

// Styles for the box displaying file information and actions
export const fileInfoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  mb: "12px",
};

// Styles for the file name text
export const fileNameStyle = {
  color: "#1a1a1a",
  fontSize: 13,
  fontWeight: 400,
};

// Styles for the date text next to file or comment
export const dateTextStyle = {
  color: "#858585",
  fontSize: 13,
  fontWeight: 400,
  ml: 1,
};

// Styles for the description or additional details text
export const descriptionStyle = {
  fontSize: 13,
  color: "#333333",
  mt: "4px",
  lineHeight: 1.6,
};

// Styles for the box containing the add button, responsive to mobile
export const addButtonBoxStyle = (isMobile: boolean) => ({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  background: "none",
  position: "static",
  bottom: "unset",
  left: "unset",
  transform: "none",
  maxWidth: isMobile ? "100%" : "none",
  boxShadow: "none",
  zIndex: "auto",
  boxSizing: "border-box",
  mt: "20px",
});

// Styles for the download button for attached files
export const downloadButtonStyle = {
   background: "#ffffffff",
  color: "#10729B",
  fontSize: "10px",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  height: "28px",
  width: "150px",
  cursor: "pointer",
  transition: "background 0.2s",
  boxShadow: "none",
  alignSelf: "flex-end",
  "&:hover": {
    background: "#ffffffff",
    boxShadow: "0 4px 14px rgba(205, 209, 214, 0.35)",
    transform: "translateY(-1px)",
  },
}

// Styles for the add button to upload or add new items
export const addButtonStyle = {
  background: "#0B4B66",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 400,
  border: "none",
  borderRadius: "8px",
  height: "28px",
  width: "150px",
  cursor: "pointer",
  transition: "background 0.2s",
  boxShadow: "none",
  alignSelf: "flex-end",
  "&:hover": {
    background: "#0B4B66",
    boxShadow: "0 4px 14px rgba(18, 47, 83, 0.35)",
    transform: "translateY(-1px)",
  },
};

// Styles for fields that have been modified (highlighted)
export const fieldModifiedStyle = {
  fontWeight: 600,
  fontSize: "13px",
  color: "#325252",
  mb: "6px",
};

// Styles for the GIS (Geographic Information System) info box
export const gisBoxStyle = {
  mt: "4px",
  mb: "2px",
};

// Styles for the GIS reference text box
export const gisReferanceStyle = {
  color: "#1a1a1a",
  fontSize: "12px",
  background: "#f6fafb",
  px: "6px",
  py: "4px",
  borderRadius: "6px",
  mb: "4px",
  display: "inline-block",
};

// Styles for the GIS reference ID text
export const gisreferanceIdStyle = {
  color: "#4257b4",
  fontWeight: 400,
};