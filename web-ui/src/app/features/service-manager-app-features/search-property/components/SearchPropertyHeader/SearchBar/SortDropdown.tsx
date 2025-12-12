// This file defines the SortDropdown component, which renders a dropdown for selecting the sort order
// in the property search bar. It uses the CustomDropdown component and passes sort options and styles.

import React from "react";
import CustomDropdown from "../../SearchPropertyButtons/CustomDropdown";
import { sortButtonSx } from "../../../styles/SearchPropertyHeader/SearchBar/SortDropdownStyle";

// List of available sort options
const SORT_OPTIONS = [
  "New - Old",
  "Old - New"
];

// Props for the SortDropdown component
interface SortDropdownProps {
  selectedSort: string; // Currently selected sort value
  onSortChange: (sort: string) => void; // Callback when sort option changes
}

// Functional component for displaying a sort dropdown in the search bar
const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange
}) => {
  return (
    <CustomDropdown
      options={SORT_OPTIONS} // List of sort options to display
      selectedValue={selectedSort} // The currently selected sort option
      onChange={onSortChange} // Handler for when a new sort option is selected
      buttonSx={sortButtonSx} // Custom styles for the dropdown button
      variant="outlined" // Use outlined button style
      minWidth={160} // Minimum width for the dropdown
    />
  );
};

export default SortDropdown;