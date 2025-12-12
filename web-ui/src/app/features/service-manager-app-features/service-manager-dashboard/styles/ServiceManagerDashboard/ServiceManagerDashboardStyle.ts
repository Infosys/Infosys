// Style objects for Service Manager Dashboard layout and UI elements

// Container for the entire dashboard page
export const dashboardContainer = {
  pt: 3 ,
  width: '80vw',
};

// Header section of the dashboard
export const dashboardHeader = {
  mb: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// Style for the main dashboard title text
export const titleText = {
  fontWeight: 600,
  mb: 0.5,
  fontFamily: 'Roboto, sans-serif',
};

// Style for subtitle text under the main title
export const subtitleText = {
  fontFamily: 'Roboto, sans-serif',
  color: 'text.secondary',
};

// Grid layout for main content (applications and agents)
export const mainContentGrid = {
  display: 'grid',
  // width: '100%',
  gridTemplateColumns: {
    xs: '1fr 0.73fr',
    lg: '1fr 0.73fr'
  },
  gap: 3,
};

// Section container for cards (applications, agents)
export const cardSection = {
  backgroundColor: '#fff',
  borderRadius: 3,
  p: 3,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

// Style for section titles (e.g., 'Recent Applications', 'Agent Directory')
export const sectionTitle = {
  mb: 2,
  fontWeight: 400,
  fontFamily: 'Roboto, sans-serif',
};

// Scrollable container for agent cards
export const scrollableAgentsContainer = {
  maxHeight: '720px', // Adjust height as needed
  overflowY: 'auto',
  overflowX: 'hidden',
  
  // Hide scrollbar for WebKit browsers (Chrome, Safari, Edge)
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  
  // Hide scrollbar for Firefox
  scrollbarWidth: 'none',
  
  // For IE (if needed)
  '-ms-overflow-style': 'none',
  
  // Optional: Add subtle padding for better spacing
  pr: 1,
};

// Style for text when no content is available
export const noContentText = {
  color: 'text.secondary',
  fontFamily: 'Roboto, sans-serif',
};

// Container for loading spinner in the dashboard
export const dashboardLoadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};

// Container for error messages in the dashboard
export const dashboardErrorContainer = {
  py: 4,
};

// Style for error alert box
export const dashboardErrorAlert = {
  mb: 2,
};

// Style for refresh icon alignment
export const refreshIconStyle = {
  display: 'flex', 
  justifyContent: 'center'
};