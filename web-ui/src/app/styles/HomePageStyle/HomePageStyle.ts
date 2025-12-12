// Style objects for main layout and UI elements on the home page

// Main container style for the page, adjusts width and margin based on sidebar state
export const mainContainerStyle = {
  marginLeft: (open: boolean) => (open ? '18vw' : '5vw'),
  width: (open: boolean) => open ? '82vw' : '95vw',
  transition: 'margin-left 0.25s ease',
  height: '100vh',
  overflowX: 'hidden',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  position: 'relative',
};

// Style for the jurisdiction dropdown, fixed at the top right
export const jurisdictionDropdownStyles = {
  position: 'absolute',
  top: '20px',
  right: '24px',
  zIndex: 200,
  boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
};

// Style for the main content area, adjusts width based on sidebar state
export const renderingContent = {
  width: (open: boolean) => open ? '82vw' : '95vw',
};
