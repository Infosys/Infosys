
// This file defines style objects for the properties view and related UI elements in the application, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific section or component in the properties view.


// Styles for the main inner container of the properties page
export const innerContainerStyle = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'none',
  justifyContent: 'space-between',
  pr: 2,
  pl:2
};

// Styles for the main title text on the properties page
export const titleStyle = {
  fontSize: 36,
  fontWeight: 700,
  ml: '20px',
  mt: '30px',
};

// Styles for the subtitle text under the main title
export const subtitleStyle = {
  fontSize: 24,
  fontWeight: 300,
  ml: 3
};

// Styles for the container holding action buttons or controls
export const actOnApplicaiton= {
display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb:2
  
}

// Styles for the select action dropdown/button
export const selectActionStyle = {
  bgcolor: '#0b5a7a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.95rem',
  cursor: 'pointer',
  minWidth: 170,
  boxShadow: 'none',
  '& .MuiSelect-icon': { color: '#fff' },
  '& fieldset': { border: 'none' },
  '& .MuiMenuItem-root': { color: '#0f172a' }
};

// Styles for the dropdown menu paper (background and text color)
export const selectMenuPaperProps = {
  sx: { bgcolor: '#fff', color: '#0f172a' },
};

// Styles for the main content grid layout of the properties page
export const mainContentStyle = {
  gridTemplateColumns: '1fr var(--right-panel-width)',
  gridTemplateRows: 'auto 1fr',
  padding: '1rem',
  alignItems: 'start',
};
