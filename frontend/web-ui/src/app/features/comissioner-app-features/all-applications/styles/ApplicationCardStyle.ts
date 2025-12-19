
// Main container for the application card
export const cardContainer = {
  display: 'flex', // Flex layout for horizontal sections
  alignItems: 'center', // Vertically center content
  justifyContent: 'space-between', // Space between left and right sections
  bgcolor: '#fff', // White background
  borderRadius: '20px', // Rounded corners
  p: 1, // Padding
  boxShadow: 'none', // No shadow
  border: '1.5px solid #e3e3e3', // Light border
  m: 0.7, // Margin
  minHeight: '135px', // Minimum height for the card
};


// Left section of the card (property info, tags, etc.)
export const cardLeftSection = {
  flex: 1, // Take up available space
  display: 'flex',
  flexDirection: 'column', // Stack vertically
  minWidth: 0, // Prevent overflow
};


// Header row for property icon and title
export const propertyHeader = {
  display: 'flex',
  alignItems: 'flex-start', // Align items to the top
  gap: 1.5, // Space between icon and title
  // mb: 1, // (Commented out) Margin bottom
};


// Style for the property icon
export const propertyIcon = {
  fontSize: 27, // Icon size
  color: '#2D2D2D', // Dark gray color
  mt: '4px', // Margin top
  mr: '4px', // Margin right
};


// Style for the property name/title
export const propertyTitle = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '20px', // Large font size
  fontWeight: 700, // Bold
  color: '#505050', // Medium gray
  lineHeight: 1.1, // Tight line height
};


// Style for the property ID text
export const propertyId = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px', // Standard font size
  color: '#555', // Gray color
  fontWeight: 400, // Normal weight
  mt: '2px', // Margin top
  letterSpacing: 0.2, // Slight letter spacing
};




// Style for the info icon (tooltip, etc.)
export const infoIcon = {
  fontSize: 18, // Icon size
  color: '#999', // Light gray
  cursor: 'pointer', // Pointer cursor on hover
  mt: '-3px', // Negative margin to align
};


// Style for the address text
export const addressText = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px', // Standard font size
  color: '#222', // Almost black
  fontWeight: 600, // Semi-bold
  mt: 1, // Margin top
  mb: 1, // Margin bottom
  letterSpacing: 0.15, // Slight letter spacing
};


// Container for property tags (chips)
export const tagsContainer = {
  display: 'flex', // Flex layout
  gap: 0.7, // Space between tags
  flexWrap: 'wrap', // Wrap to next line if needed
};


// Style for a colored tag chip (dynamic background color)
export const coloredTagChip = (color: string) => ({
  bgcolor: color, // Dynamic background color
  // border: '1.5px solid #222', // (Commented out) Optional border
  fontSize: '10px', // Small font
  height: '22px', // Chip height
  borderRadius: '20px', // Pill shape
  fontFamily: 'Roboto, sans-serif',
  color: '#222', // Text color
  fontWeight: 500, // Medium weight
  // px: 1, // (Commented out) Optional padding
  // mr: 0.5, // (Commented out) Optional margin right
  boxShadow: 'none', // No shadow
  '& .MuiChip-icon': {
    fontSize: 14, // Icon size
    color: '#222', // Icon color
    ml: 0.7, // Margin left
  },
});


// Style for a default (white) tag chip
export const tagChip = {
  bgcolor: '#fff', // White background
  border: '1.5px solid #222', // Solid border
  fontSize: '10px', // Small font
  height: '22px', // Chip height
  borderRadius: '20px', // Pill shape
  fontFamily: 'Roboto, sans-serif',
  color: '#222', // Text color
  fontWeight: 500, // Medium weight
  // px: 1, // (Commented out) Optional padding
  // mr: 0.5, // (Commented out) Optional margin right
  boxShadow: 'none', // No shadow
  '& .MuiChip-icon': {
    fontSize: 14, // Icon size
    color: '#222', // Icon color
    ml: 0.7, // Margin left
  },
};


// Right section of the card (actions, images, map)
export const cardRightSection = {
  display: 'flex',
  flexDirection: 'column', // Stack vertically
  alignItems: 'flex-end', // Align to the right
  justifyContent: 'center', // Center vertically
  minWidth: '380px', // Minimum width for layout
};


// Container for action buttons (view, assign, etc.)
export const actionsContainer = {
  display: 'flex', // Flex layout
  gap: 1, // Space between buttons
  mb: 1, // Margin bottom
  justifyContent: 'flex-end', // Align to the right
};


// Style for the 'View Location' button
export const viewLocationButton = {
  borderRadius: '10px', // Rounded corners
  textTransform: 'none', // No uppercase
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px', // Small font
  fontWeight: 500, // Medium weight
  px: 2.2, // Horizontal padding
  height: '30px', // Button height
  color: "#000", // Black text
  backgroundColor: '#FBEEE8', // Light orange background
};


// Style for the 'View Application' button
export const viewApplicationButton = {
  borderRadius: '10px', // Rounded corners
  textTransform: 'none', // No uppercase
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px', // Small font
  fontWeight: 500, // Medium weight
  px: 2.2, // Horizontal padding
  height: '30px', // Button height
  bgcolor: '#0B4B66', // Dark blue background
  color: '#fff', // White text
  border: 'none', // No border
};


// Container for property images
export const imagesSection = {
  display: 'flex', // Flex layout
  gap: 2, // Space between images
  mt: '2px', // Margin top
};


// Style for each image box (thumbnail)
export const imageBox = {
  width: '86px', // Fixed width
  height: '64px', // Fixed height
  borderRadius: '10px', // Rounded corners
  display: 'flex',
  alignItems: 'center', // Center image vertically
  justifyContent: 'center', // Center image horizontally
  bgcolor: '#F7F7F7', // Light gray background
  boxShadow: 'none', // No shadow
};


// Style for the map preview box
export const mapBox = {
  width: '86px', // Fixed width
  height: '64px', // Fixed height
  borderRadius: '10px', // Rounded corners
  overflow: 'hidden', // Hide overflow (for map tiles)
  border: 'none', // No border
  bgcolor: '#F7F7F7', // Light gray background
  display: 'flex',
  alignItems: 'center', // Center map vertically
  justifyContent: 'center', // Center map horizontally
};