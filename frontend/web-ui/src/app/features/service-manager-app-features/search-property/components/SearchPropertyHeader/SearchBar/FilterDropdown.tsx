// This file defines the FilterDropdown component, which renders a dropdown for selecting a filter option
// in the property search bar. It uses the CustomDropdown component and passes filter options and styles.

import React from "react";
import CustomDropdown from "../../SearchPropertyButtons/CustomDropdown";
import {
  filterButtonSx,
  filterMenuPaperSx,
  filterMenuItemSx,
} from "../../../styles/SearchPropertyHeader/SearchBar/FilterDropdownStyle";
import { FILTER_OPTIONS } from "../../../utils/constants";

// Props for the FilterDropdown component
interface FilterDropdownProps {
  selectedFilter: string; // Currently selected filter value
  onFilterChange: (filter: string) => void; // Callback when filter changes
}

// Functional component for displaying a filter dropdown in the search bar
const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedFilter,
  onFilterChange,
}) => (
  <CustomDropdown
    options={FILTER_OPTIONS} // List of filter options to display
    selectedValue={selectedFilter} // The currently selected filter
    onChange={onFilterChange} // Handler for when a new filter is selected
    buttonSx={filterButtonSx} // Custom styles for the dropdown button
    paperSx={filterMenuPaperSx} // Custom styles for the dropdown menu
    menuItemSx={filterMenuItemSx} // Custom styles for each menu item
    variant="contained" // Use contained button style
    minWidth={180} // Minimum width for the dropdown
  />
);

export default FilterDropdown;