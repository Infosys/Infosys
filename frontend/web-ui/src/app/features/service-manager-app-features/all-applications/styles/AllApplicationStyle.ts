// Style objects for the All Applications page in the Service Manager module
// These styles control the layout, appearance, and UI elements for the applications list and filters

export const pageContainer = {
  pt: 3 ,
  width: '80vw', // Main container width
  // overflowX: 'none',
};

// Styles for the header section (title, subtitle)
export const headerSection = {
  mb: 3,
};

// Styles for the main page title
export const titleText = {
  fontWeight: 600,
  mb: 0.5,
  fontFamily: 'Roboto, sans-serif',
  fontSize: '32px',
  color: '#1a1a1a',
};

// Styles for the subtitle text
export const subtitleText = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px',
  color: '#666',
  fontWeight: 400,
};

// Styles for the row containing filters, sort, and search
export const filterRow = {
  display: 'flex',
  gap: 2,
  mb: 3,
  alignItems: 'center',
  height: '40px', // Fixed height for filter row
};

// Styles for the filter dropdown
export const filterDropdown = {
  minWidth: '160px',
  height: '40px', // Match the filterRow height
};

// Styles for the sort dropdown
export const sortDropdown = {
  minWidth: '140px',
  height: '40px', // Match the filterRow height
};

// Styles for the search field input
export const searchField = {
  flexGrow: 1,
  bgcolor: '#fff',
  borderRadius: '24px',
  height: '40px', // Explicit height for search field
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.28)',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none', // Remove default border
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 14px', // Padding for input
    fontSize: '14px', // Input font size
  },
};

// Styles for the container holding the list of applications
export const applicationsContainer = {
  display: 'flex',
  flexDirection: 'column',
  bgcolor: '#fff',
  borderRadius: '8px',
  height: '85%',
  overflowY: 'auto',
  // mb: 3,
  pl: 3,
  pr: 2,
  py: 3,
  gap: 1,
  '&::-webkit-scrollbar': {
    width: '6px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c84c03',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
};

// Styles for the loading spinner/container
export const loadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80%',
};