
/**
 * This component renders a group of selectable chips for multi-select filtering.
 * Users can select or deselect options, and the selected chips are styled differently.
 * Useful for tag-based or categorical filtering in forms and search UIs.
 */
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";


// Option type for each chip in the group
export interface MultiSelectChipOption {
  value: string; // The value of the chip
  label: string; // The display label of the chip
}


// Props for the MultiSelectChipGroup component
export interface MultiSelectChipGroupProps {
  options: MultiSelectChipOption[];      // List of chip options
  selectedValues: string[];              // Currently selected values
  onChange: (values: string[]) => void;  // Handler for selection changes
  sx?: object;                           // Optional styles for the container
  chipSx?: object;                       // Optional styles for individual chips
}


// Functional component to render a group of selectable chips for multi-select
const MultiSelectChipGroup: React.FC<MultiSelectChipGroupProps> = ({
  options,
  selectedValues,
  onChange,
  sx,
  chipSx,
}) => {
  // Handle chip click to toggle selection
  const handleChipClick = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2, ...sx }}>
      {options.map(option => (
        <Chip
          key={option.value}
          label={option.label}
          clickable
          onClick={() => handleChipClick(option.value)}
          sx={{
            fontWeight: 500,
            px: 1,
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: selectedValues.includes(option.value) ? "#c84c03" : "#fff",
            color: selectedValues.includes(option.value) ? "#fff" : "#222",
            border: selectedValues.includes(option.value) ? "none" : "1px solid #ccc",
            ...chipSx,
            "&:hover": {
              backgroundColor: selectedValues.includes(option.value)
                ? "#a23b02"
                : "#ffeed0",
            },
          }}
        />
      ))}
    </Box>
  );
};


// Export the MultiSelectChipGroup component as default
export default MultiSelectChipGroup;