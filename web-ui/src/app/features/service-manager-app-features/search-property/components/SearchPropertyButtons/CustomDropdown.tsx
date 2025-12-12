// This file defines the CustomDropdown component, which renders a customizable dropdown menu
// using Material-UI components. It allows users to select an option from a list and supports
// custom styles and button variants.

import React from "react";
import { Button, Menu, MenuItem, type SxProps, type Theme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface CustomDropdownProps {
  options: string[]; // List of options to display in the dropdown
  selectedValue: string; // The currently selected value
  onChange: (value: string) => void; // Callback when a new option is selected
  buttonSx?: SxProps<Theme>; // Optional custom styles for the button
  paperSx?: SxProps<Theme>; // Optional custom styles for the dropdown menu
  menuItemSx?: SxProps<Theme>; // Optional custom styles for each menu item
  variant?: "contained" | "outlined"; // Button style variant
  minWidth?: string | number; // Minimum width for the button and menu
}

// Functional component for displaying a dropdown menu with custom options and styles
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onChange,
  buttonSx,
  paperSx,
  menuItemSx,
  variant = "contained",
  minWidth,
}) => {
  // State to keep track of the anchor element for the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // Boolean to determine if the menu is open
  const isOpen = Boolean(anchorEl);

  // Handle button click to open the dropdown menu
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close and trigger onChange if a new value is selected
  const handleMenuClose = (value?: string) => {
    if (value && value !== selectedValue) {
      onChange(value);
    }
    setAnchorEl(null);
  };

  return (
    <>
      {/* Button that shows the selected value and opens the dropdown menu */}
      <Button
        onClick={handleButtonClick}
        endIcon={<KeyboardArrowDownIcon />}
        variant={variant}
        disableElevation
        sx={{ ...buttonSx, minWidth }}
      >
        {selectedValue}
      </Button>

      {/* Dropdown menu with selectable options */}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => handleMenuClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              ...paperSx,
              // Ensure the menu width matches the button width
              minWidth: anchorEl ? anchorEl.offsetWidth : minWidth,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleMenuClose(option)}
            sx={menuItemSx}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Export the CustomDropdown component as default
export default CustomDropdown;