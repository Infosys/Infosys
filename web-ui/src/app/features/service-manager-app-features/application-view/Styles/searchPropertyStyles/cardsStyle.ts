
// This file defines style objects for property and note cards in the application view, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific card or card element.
import { type SxProps, type Theme } from "@mui/material";

// Styles for the grid layout containing property detail cards
export const propertyDetailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '2.4fr 2.4fr 270px' },
  gridAutoRows: 'auto',
  gap: '0.9rem',
  marginTop: '1rem',
};

// Styles for the main property detail card
export const cardStyle = {
  bgcolor: '#fff',
  p: '1rem 1.25rem',
  borderRadius: '8px',
  border: '1px solid #e9e9ef',
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'stretch',
};

// Styles for the edit button on a card
export const editButtonStyle = {
  position: 'absolute',
  right: 10,
  top: 10,
  border: 'none',
  bgcolor: '#fff',
  borderRadius: '6px',
  p: '6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  cursor: 'pointer',
  '&:hover': { bgcolor: '#f4f4f4' },
};

// Styles for the label text in a card row
export const cardLabelStyle = {
  fontWeight: 800,
  marginRight: '8px',
  fontSize: 14
};
// Styles for the content text in a card row
export const cardContentStyle = {
  fontSize: 14,
  fontWeight: 300
};

// Styles for a row within a card
export const cardRowStyle = {
  mb: 0.3,
};

// Styles for the header label of a card
export const cardHeaderLabelStyle: SxProps<Theme> = {
  fontSize: 16,
  fontStyle: 'italic',
  mb: '10px',
};
// Styles for the last row in a card (currently empty, can be extended)
export const lastCardRowStyle: SxProps<Theme> = {};

// Styles for the note card component
export const noteCardStyle: SxProps<Theme> = {
  bgcolor: '#fff',
  p: '1rem 1.25rem',
  borderRadius: '8px',
  border: '1px solid #e9e9ef',
  gridColumn: { md: 'span 2' },
  alignSelf: 'stretch',
};

// Styles for the header section of a note card
export const noteHeaderStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 0.5,
};

// Styles for the label in the note card header
export const noteLabelStyle: SxProps<Theme> = {
  fontStyle: 'italic',
  fontSize: 15,
  fontWeight: 400,
  mr: 1,
};

// Styles for the date display in the note card header
export const noteDateStyle: SxProps<Theme> = {
  fontSize: 12,
  border: '#424242 1px solid',
  borderRadius: '10px',
  px: '0.6em',
  py: '0.18em',
};

// Styles for the main content text of a note card
export const noteContentTextStyle: SxProps<Theme> = {
  fontWeight: 300,
  fontSize: 14,
};

// --- Added for inline style replacement below ---

// Styles for the card that tracks application progress or status
export const trackCardStyle: SxProps<Theme> = {
  alignSelf: 'start',
  position: 'relative',
  gridColumn: { xs: '1 / -1', md: '3 / 4' },
  gridRow: { md: '1 / span 4' },
  marginTop: { xs: '1rem', md: 0 },
  minWidth: 250,
  boxShadow: { xs: "none", sm: "0 1px 12px rgba(0,0,0,0.1)" },
  minHeight: { xs: 'auto', md: "100vh" },
  background: { xs: "#ffffff", sm: "#f0f0f0" },
  borderRadius: { xs: 0, sm: "18px" },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

// Styles for the note card when displayed in a grid layout
export const noteCardGridStyle: SxProps<Theme> = {
  ...noteCardStyle,
  gridColumn: { xs: '1 / -1', md: '1 / span 2' },
  marginTop: 2
};