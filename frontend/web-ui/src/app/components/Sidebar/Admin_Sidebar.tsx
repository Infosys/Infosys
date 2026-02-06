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

export interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  group?: 'primary' | 'secondary';
}

/**
 * Props:
 * - open: whether sidebar is expanded
 * - onToggle: callback to toggle expansion (handled by parent HomePage)
 * - selectedNav: currently selected nav item key
 * - onSelectNav: callback to change selected nav item
 * - primaryItems: array of navigation items to display in the primary section
 */
export interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
  selectedNav: string;
  onSelectNav: (key: string) => void;
  primaryItems: NavItem[];
  onProfileClick?: (anchorEl: HTMLElement | null) => void;
  primaryColor?: string;
  secondaryColor?: string;
}

const secondaryItems: NavItem[] = [
  { key: 'helpDesk', label: 'Help Desk', icon: <ErrorOutlineOutlinedIcon />, group: 'secondary' },
  { key: 'language', label: 'Language', icon: <img src={hindiEnglishIcon} alt="Language" width={25} height={25} />, group: 'secondary' },
  { key: 'profile', label: 'Profile', icon: <AccountCircleOutlinedIcon />, group: 'secondary' },
  { key: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon />, group: 'secondary' }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  open, 
  onToggle, 
  selectedNav, 
  onSelectNav, 
  primaryItems, 
  onProfileClick,
  primaryColor = '#FBEEE8',
  secondaryColor = '#F4D5C6'
}) => {

  const profileButtonRef = React.useRef<HTMLDivElement | null>(null);

  const handleSecondaryItemClick = (_key: string) => {
    // Special logic for secondary items if needed
  };

  return (
    <Box component="nav" sx={style.sidebarNavBox(open, primaryColor)}>
      {/* Toggle button */}
      <Box sx={style.sidebarToggleRow(open)}>
        {open && (<Box></Box>)}
        <IconButton
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={onToggle}
          size="small"
          sx={style.sidebarToggleButton(secondaryColor)}
        >
          <MenuOutlinedIcon />
        </IconButton>
      </Box>

      {/* Primary navigation */}
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
                title={open ? '' : item.label}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => onSelectNav(item.key)}
                  sx={style.navListItemButton(selectedNav === item.key, open, secondaryColor)}
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

      {/* Spacer to push secondary items to bottom */}
      <Box sx={style.bottomSpacer} />

      <Divider sx={style.dividerStyle(open)} />

      {/* Secondary navigation */}
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
              <Tooltip title={open ? '' : item.label} placement="right" arrow>
                <ListItemButton
                  ref={isProfile ? profileButtonRef : undefined}
                  onClick={() => {
                    handleSecondaryItemClick(item.key);
                    if (isProfile && onProfileClick) {
                      onProfileClick(profileButtonRef.current);
                    }
                  }}
                  sx={style.navListItemButtonSecondary(isSelected, open, secondaryColor)}
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
