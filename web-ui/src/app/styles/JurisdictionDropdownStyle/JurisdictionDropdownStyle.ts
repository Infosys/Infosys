// Style objects and functions for the Jurisdiction Dropdown component
// Used for styling the dropdown, menu, and items in the UI

// Style for the main dropdown box, with dynamic background and hover color
export const jurisdictionDropdownBox = (backgroundColor: string, hoverBackgroundColor: string) => ({
  width: '260px',
  height: '60px',
  backgroundColor: backgroundColor,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: hoverBackgroundColor,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
});

// Style for the row containing jurisdiction info and icon
export const jurisdictionInfoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

// Style for the location icon in the dropdown
export const locationIcon = {
  fontSize: 28,
  color: '#333',
};

// Style for the jurisdiction label text
export const jurisdictionLabel = {
  fontSize: '11px',
  color: '#666',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  lineHeight: 1.2,
  mb: 0.3,
};

// Style for the jurisdiction name text
export const jurisdictionName = {
  fontSize: '12px',
  color: '#222',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  lineHeight: 1.2,
};

// Style for the dropdown arrow icon, rotates when open
export const dropdownArrow = (open: boolean) => ({
  fontSize: 22,
  color: '#333',
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease',
});

// Style for the dropdown menu container
export const dropdownMenu = {
  mt: 1,
  '& .MuiPaper-root': {
    width: '260px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
  },
};

// Style for each dropdown menu item, with dynamic selection and hover colors
export const dropdownMenuItem = (
  selected: boolean,
  selectedBackgroundColor: string,
  hoverBackgroundColor: string
) => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px',
  py: 1.5,
  px: 2,
  '&.Mui-selected': {
    backgroundColor: `${selectedBackgroundColor} !important`,
    '&:hover': {
      backgroundColor: `${hoverBackgroundColor} !important`,
    },
  },
  '&:hover': {
    backgroundColor: selected ? undefined : hoverBackgroundColor,
  },
});