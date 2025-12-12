// This file contains the JurisdictionDropdown component, which allows users to select their jurisdiction (zone and wards) from a dropdown menu.
// The component uses Redux to manage the selected zone and displays the user's available jurisdictions.
import React, { useEffect, useState } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
  jurisdictionDropdownBox,
  jurisdictionInfoRow,
  locationIcon,
  jurisdictionLabel,
  jurisdictionName,
  dropdownArrow,
  dropdownMenuItem,
} from '../../styles/JurisdictionDropdownStyle/JurisdictionDropdownStyle';
import { useGetUserJurisdiction } from './customHook/useGetUserJurisdiction';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedZone } from '../../../store/userSlice';
import type { RootState } from '../../../store';

// Represents a jurisdiction option in the dropdown
interface Jurisdiction {
  id: string;
  name: string;
}

// Props for customizing the dropdown's background colors
interface JurisdictionDropdownProps {
  backgroundColor: string;
  hoverBackgroundColor: string;
}


export const JurisdictionDropdown: React.FC<JurisdictionDropdownProps> = ({ 
  backgroundColor,
  hoverBackgroundColor,
}) => {
  // Get the user's available zones from the custom hook
  const zonesData = useGetUserJurisdiction();
  const dispatch = useDispatch();
  
  // Get the currently selected zone from Redux
  const selectedZone = useSelector((state: RootState) => state.user.selectedZone);

  // Build the list of jurisdictions for the dropdown menu
  const jurisdictions: Jurisdiction[] = zonesData.map((zone) => ({
    id: zone.zoneNumber,
    name: `${zone.zoneNumber}: ${zone.wards.join(', ')}`
  }));

  // Helper to get zone data by its number
  const getZoneDataById = (zoneNumber: string) => zonesData.find(z => z.zoneNumber === zoneNumber);

  // State for the anchor element of the dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // State for the currently selected jurisdiction (displayed in the dropdown)
  // Initialize from Redux or default to the first jurisdiction
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>(() => {
    if (selectedZone) {
      return `${selectedZone.zoneNumber}: ${selectedZone.wards.join(', ')}`;
    }
    return jurisdictions[0]?.name || '';
  });
  
  // Boolean to control if the dropdown menu is open
  const open = Boolean(anchorEl);

  // Handle clicking the dropdown to open the menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // On mount, set the default selected zone if not already set in Redux
  useEffect(() => {
    if (zonesData.length > 0 && !selectedZone) {
      setSelectedJurisdiction(jurisdictions[0].name);
      dispatch(setSelectedZone(zonesData[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zonesData.length, selectedZone]);

  // When the selected zone in Redux changes, update the local selectedJurisdiction state
  useEffect(() => {
    if (selectedZone) {
      const displayName = `${selectedZone.zoneNumber}: ${selectedZone.wards.join(', ')}`;
      setSelectedJurisdiction(displayName);
    }
  }, [selectedZone]);

  // Handle selecting a jurisdiction from the dropdown
  const handleSelect = (jurisdiction: string) => {
    setSelectedJurisdiction(jurisdiction);
    const zoneNumber = jurisdiction.split(':')[0].trim();
    const zoneDataObj = getZoneDataById(zoneNumber);
    if (zoneDataObj) {
      dispatch(setSelectedZone(zoneDataObj));
    }
    handleClose();
  };

  return (
    <>
      {/* Dropdown box that shows the current jurisdiction and opens the menu */}
      <Box onClick={handleClick} sx={jurisdictionDropdownBox(backgroundColor, hoverBackgroundColor)}>
        <Box sx={jurisdictionInfoRow}>
          <LocationOnOutlinedIcon sx={locationIcon} />
          <Box>
            <Typography sx={jurisdictionLabel}>Jurisdiction</Typography>
            <Typography sx={jurisdictionName}>
              {selectedJurisdiction}
            </Typography>
          </Box>
        </Box>
        <KeyboardArrowDownIcon sx={dropdownArrow(open)} />
      </Box>

      {/* Dropdown menu listing all available jurisdictions */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: '260px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#fff',
          }
        }}
      >
        {jurisdictions.map((jurisdiction) => (
          <MenuItem
            key={jurisdiction.id}
            onClick={() => handleSelect(jurisdiction.name)}
            selected={selectedJurisdiction === jurisdiction.name}
            sx={dropdownMenuItem(
              selectedJurisdiction === jurisdiction.name,
              backgroundColor,
              hoverBackgroundColor
            )}
          >
            {jurisdiction.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};