// This file contains the Sidebar component for the Service Manager dashboard.
// It renders the sidebar navigation, supports toggling, and includes primary/secondary navigation and profile/settings/help actions.
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import * as style from '../../styles/SideBar/SidebarStyle';

import hindiEnglishIcon from '../Sidebar/assets/hindi_english_icon.svg';

// Represents a navigation item in the sidebar
export interface NavItem {
  key: string; // Unique key for the nav item
  label: string; // Display label
  icon: React.ReactNode; // Icon to show
  group?: 'primary' | 'secondary'; // Group type (optional)
}

// Props for the Sidebar component
// - open: whether sidebar is expanded
// - onToggle: callback to toggle expansion (handled by parent)
// - selectedNav: currently selected nav item key
// - onSelectNav: callback to change selected nav item
// - primaryItems: array of navigation items to display in the primary section
// - onProfileClick: callback for profile button (optional)
// - allApplicationsToggle/setAllApplicationsToggle: toggles for extra features (optional)
export interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  selectedNav: string;
  onSelectNav: (key: string) => void;
  primaryItems: NavItem[];
  onProfileClick?: (anchorEl: HTMLElement | null) => void;
  allApplicationsToggle?: boolean;
  setAllApplicationsToggle?: (toggle: boolean) => void;
}

// Secondary navigation items (bottom of sidebar)
const secondaryItems: NavItem[] = [
  { key: 'helpDesk', label: 'Help Desk', icon: <ErrorOutlineOutlinedIcon />, group: 'secondary' },
  { key: 'language', label: 'Language', icon: <img src={hindiEnglishIcon} alt="Language" width={25} height={25} />, group: 'secondary' },
  { key: 'profile', label: 'Profile', icon: <AccountCircleOutlinedIcon />, group: 'secondary' },
  { key: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon />, group: 'secondary' }
];


export const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onToggle, 
  selectedNav, 
  onSelectNav, 
  primaryItems, onProfileClick, 
  allApplicationsToggle: _allApplicationsToggle, 
  setAllApplicationsToggle: _setAllApplicationsToggle 
}) => {
  // Ref for the profile button (used for anchoring profile modal)
  const profileButtonRef = React.useRef<HTMLDivElement | null>(null);

  // Handler for secondary item clicks (extend for custom logic if needed)
  const handleSecondaryItemClick = (_key: string) => {
    // Special logic for secondary items if needed
  };

  return (
    <Box component="nav" sx={style.sidebarNavBox(open)}>
      {/* Toggle button for expanding/collapsing sidebar */}
      <Box sx={style.sidebarToggleRow(open)}>
        {open && (<Box></Box>)}
        <IconButton
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={onToggle}
          size="small"
          sx={style.sidebarToggleButton()}
        >
          <MenuOutlinedIcon />
        </IconButton>
      </Box>

      {/* Primary navigation section (top of sidebar) */}
      <List disablePadding sx={style.navList}>
        {primaryItems.map(item => {
          const isSelected = selectedNav === item.key;
          return (
            <ListItem
              key={item.key}
              disablePadding
              sx={style.primaryListItem(open)}
            >
              <Tooltip
                title={!open ? item.label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => onSelectNav(item.key)}
                  sx={style.navListItemButton(selectedNav === item.key, open, undefined)}
                >
                  <ListItemIcon sx={style.listItemIcon(open)}>
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: style.listItemText(isSelected)
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Spacer to push secondary items to the bottom of the sidebar */}
      <Box sx={style.bottomSpacer} />

      <Divider sx={style.dividerStyle(open)} />

      {/* Secondary navigation section (bottom of sidebar) */}
      <List disablePadding sx={style.navList}>
        {secondaryItems.map(item => {
          const isSelected = selectedNav === item.key;
          const isProfile = item.key === 'profile';
          return (
            <ListItem
              key={item.key}
              disablePadding
              sx={style.secondaryListItem(open)}
            >
              <Tooltip title={!open ? item.label : ''} placement="right" arrow>
                <ListItemButton
                  ref={isProfile ? profileButtonRef : undefined}
                  onClick={() => {
                    handleSecondaryItemClick(item.key);
                    // If profile is clicked, call the profile click handler with the button ref
                    if (isProfile && onProfileClick) {
                      onProfileClick(profileButtonRef.current);
                    }
                  }}
                  sx={style.navListItemButtonSecondary(isSelected, open, undefined)}
                >
                  <ListItemIcon sx={style.listItemIconSecondary(open)}>
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: style.listItemText(isSelected)
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};