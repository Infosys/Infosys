
// Main container for the All Applications page
export const pageContainer = {
  pt: 3, // Padding top
  width: '80vw', // 80% of viewport width
};


// Styles for the header section (title, filters, etc.)
export const headerSection = {
  mb: 3, // Margin bottom
};


// Styles for the main title text
export const titleText = {
  fontWeight: 600, // Bold
  mb: 0.5, // Margin bottom
  fontFamily: 'Roboto, sans-serif', // Font family
  fontSize: '32px', // Large font size
  color: '#1a1a1a', // Dark color
};


// Styles for the subtitle or description text
export const subtitleText = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px', // Standard font size
  color: '#666', // Gray color
  fontWeight: 400, // Normal weight
};


// Row container for filter controls (search, sort, etc.)
export const filterRow = {
  display: 'flex', // Flex layout
  gap: 2, // Gap between children
  mb: 3, // Margin bottom
  alignItems: 'center', // Vertically center items
};


// Styles for the search input field
export const searchField = {
  flexGrow: 1, // Take up remaining space
  bgcolor: '#fff', // White background
  borderRadius: '24px', // Rounded corners
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px', // Rounded input
    height: '48px', // Input height
    fontFamily: 'Roboto, sans-serif',
    '& fieldset': {
      border: '1px solid #e0e0e0', // Default border
    },
    '&:hover fieldset': {
      border: '1px solid #999', // Border on hover
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #C84C0E', // Border when focused
    },
  },
};


// Styles for the sort dropdown menu
export const sortDropdown = {
  minWidth: '150px', // Minimum width
};


// Container for the list of application cards
export const applicationsContainer = {
  display: 'flex', // Flex layout
  flexDirection: 'column', // Stack vertically
  bgcolor: '#fff', // White background
  borderRadius: '8px', // Rounded corners
  height: '85vh', // Take up most of the viewport height
  overflowY: 'auto', // Enable vertical scrolling
  // mb: 3, // (Commented out) Margin bottom
  pl: 3, // Padding left
  pr: 2, // Padding right
  py: 3, // Padding top and bottom
  gap: 1, // Gap between cards
  // Custom scrollbar styles
  '&::-webkit-scrollbar': {
    width: '6px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c84c03', // Orange thumb
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
};


// Container for loading spinner or loading state
export const loadingContainer = {
  display: 'flex', // Flex layout
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  minHeight: '100vh', // Take up full viewport height
};