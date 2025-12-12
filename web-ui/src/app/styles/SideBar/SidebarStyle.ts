export const sidebarNavBox = (open: boolean, primaryColor: string = '#FBEEE8') => ({
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: open ? '18vw' : '5vw',
  flexShrink: 0,
  bgcolor: primaryColor,
  borderRight: '1px solid #e0cfc7',
  transition: 'width 0.25s ease',
  overflowX: 'hidden',
  overflow: 'hidden',
  boxSizing: 'border-box',
  paddingTop: 2,
  paddingBottom: 2,
  zIndex: 1200,
});

// Style for the row containing the sidebar toggle button
export const sidebarToggleRow = (open: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'flex-start' : 'center',
  px: open ? 2 : 0,
  mb: 2,
});

export const sidebarToggleButton = (secondaryColor: string = '#F4D5C6') => ({
  bgcolor: secondaryColor,
  border: `1px solid ${secondaryColor}`,
  '&:hover': { bgcolor: secondaryColor },
  transition: 'transform 0.25s',
});

// Style for the navigation list container
export const navList = {
  px: 0,
};

// Style for primary navigation list items
export const primaryListItem = (open: boolean) => ({
  display: 'block',
  mb: open ? 1.5 : 2,
});

export const navListItemButton = (isSelected: boolean, open: boolean, secondaryColor: string = '#F4D5C6') => ({
  mx: open ? 2 : 1,
  justifyContent: open ? 'flex-start' : 'center',
  borderRadius: 28,
  height: 38,
  // px: open ? 2 : 0,
  transition: 'background-color 0.15s ease, color 0.15s ease, padding 0.25s',
  ...(isSelected
    ? {
        bgcolor: secondaryColor,
        '&:hover': { bgcolor: secondaryColor },
      }
    : {
        '&:hover': { bgcolor: secondaryColor },
      }),
});

// Style for the icon in navigation list items (primary)
export const listItemIcon = (open: boolean) => ({
  minWidth: 0,
  mr: open ? 1.5 : 0,
  color: '#1a1a1a',
  display: 'flex',
  justifyContent: 'center',
});

// Style for the text in navigation list items
export const listItemText = (_isSelected: boolean) => ({
  // whiteSpace: 'nowrap',
  color: '#000',
  fontSize: 13,
  fontWeight: 600,
});

// Style for secondary navigation list items
export const secondaryListItem = (open: boolean) => ({
  display: 'block',
  mb: open ? 1.5 : 2,
});

export const navListItemButtonSecondary = (isSelected: boolean, open: boolean, secondaryColor: string = '#F4D5C6') => ({
  mx: open ? 2 : 1,
  justifyContent: open ? 'flex-start' : 'center',
  borderRadius: 28,
  height: 38,
  // px: open ? 2 : 0,
  transition: 'background-color 0.15s ease, color 0.15s ease, padding 0.25s',
  ...(isSelected
    ? {
        bgcolor: secondaryColor,
        '&:hover': { bgcolor: secondaryColor },
      }
    : {
        '&:hover': { bgcolor: secondaryColor },
      }),
});

// Style for the icon in navigation list items (secondary)
export const listItemIconSecondary = (open: boolean) => ({
  minWidth: 0,
  mr: open ? 1.5 : 0,
  display: 'flex',
  justifyContent: 'center',
  color: '#1a1a1a',
});

export const languageIconBox = (secondaryColor: string = '#F4D5C6') => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  bgcolor: secondaryColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 22,
});

// Style for the divider between sections in the sidebar
export const dividerStyle = (open: boolean) => ({
  mx: open ? 2 : 0,
  my: 1,
  borderColor: '#e6d5ce',
});

// Spacer to push content to the top of the sidebar
export const bottomSpacer = { flexGrow: 1 };