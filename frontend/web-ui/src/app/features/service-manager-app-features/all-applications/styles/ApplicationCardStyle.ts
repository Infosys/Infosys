// Style objects for the Application Card component in the All Applications page
// These styles control the layout, appearance, and UI elements for each property application card

// Main container for the application card
export const cardContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: '#fff',
  borderRadius: '20px',
  p: 1,
  boxShadow: 'none',
  border: '1.5px solid #e3e3e3',
  m: 0.7,
  minHeight: '135px',
};

// Left section of the card (property info)
export const cardLeftSection = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

// Header row for property title and icon
export const propertyHeader = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  // mb: 1,
};

// Icon for the property
export const propertyIcon = {
  fontSize: 27,
  color: '#2D2D2D',
  mt: '4px',
};

// Title text for the property
export const propertyTitle = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '20px',
  fontWeight: 700,
  color: '#505050',
  lineHeight: 1.1,
};

// Property ID text
export const propertyId = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px',
  color: '#555',
  fontWeight: 400,
  mt: '2px',
  letterSpacing: 0.2,
};



// Info icon style
export const infoIcon = {
  fontSize: 18,
  color: '#999',
  cursor: 'pointer',
  mt: '-3px',
};

// Address text style
export const addressText = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px',
  color: '#222',
  fontWeight: 600,
  mt: 1,
  mb: 1,
  letterSpacing: 0.15,
};

// Container for tag chips
export const tagsContainer = {
  display: 'flex',
  gap: 0.7,
  flexWrap: 'wrap',
};

// Colored tag chip style (function for dynamic color)
export const coloredTagChip = (color:string) => ({
  bgcolor: color,
  // border: '1.5px solid #222',
  fontSize: '10px',
  height: '22px',
  borderRadius: '20px',
  fontFamily: 'Roboto, sans-serif',
  color: '#ffffffff',
  fontWeight: 500,
  // px: 1,
  // mr: 0.5,
  boxShadow: 'none',
  '& .MuiChip-icon': {
    fontSize: 14,
    color: '#222',
    ml: 0.7,
  },
});

// Default tag chip style
export const tagChip = {
  bgcolor: '#fff',
  border: '1.5px solid #222',
  fontSize: '10px',
  height: '22px',
  borderRadius: '20px',
  fontFamily: 'Roboto, sans-serif',
  color: '#222',
  fontWeight: 500,
  // px: 1,
  // mr: 0.5,
  boxShadow: 'none',
  '& .MuiChip-icon': {
    fontSize: 14,
    color: '#222',
    ml: 0.7,
  },
};

// Right section of the card (actions, images, map)
export const cardRightSection = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
  minWidth: '300px',
};

// Container for action buttons
export const actionsContainer = {
  display: 'flex',
  gap: 1,
  mb: 1,
  justifyContent: 'flex-end',
};

// Style for the priority button (function for dynamic priority)
export const priorityButton = (applicationPriority: string) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  px: 2.2,
  height: '30px',
  border: '2px solid #0B4B66',
  color: (!applicationPriority || applicationPriority === '' || applicationPriority === null) ? '#0B4B66' : `#fff`,
  backgroundColor: (!applicationPriority || applicationPriority === '' || applicationPriority === null) ? '#fff' : `#0B4B66`,
  borderWidth: '2px',
});

// Style for the assign button
export const assignButton = {
  borderRadius: '10px',
  textTransform: 'none',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  px: 2.2,
  height: '30px',
  bgcolor: '#C84C0E',
  color: '#fff',
  border: 'none',
};

// Section for images in the card
export const imagesSection = {
  display: 'flex',
  gap: 2,
  mt: '2px',
};

// Style for each image box
export const imageBox = {
  width: '86px',
  height: '64px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: '#F7F7F7',
  boxShadow: 'none',
};

// Style for the map box in the card
export const mapBox = {
  width: '86px',
  height: '64px',
  borderRadius: '10px',
  overflow: 'hidden',
  border: 'none',
  bgcolor: '#F7F7F7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};