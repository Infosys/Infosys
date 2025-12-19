
/**
 * This component renders a multi-select autocomplete input with custom tags.
 * Users can select multiple options, and each selection is shown as a removable chip below the input.
 * Useful for filtering or tagging scenarios in forms and search UIs.
 */
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material';


// Props for the MultiSelectAutocomplete component
interface MultiSelectAutocompleteProps {
  options: string[];                // List of selectable options
  value: string[];                  // Currently selected values
  onChange: (value: string[]) => void; // Handler for selection changes
  placeholder?: string;             // Placeholder text for the input
  label?: string;                   // Label for the input
  disabled?: boolean;               // Whether the input is disabled
  loading?: boolean;                // Whether the input is in loading state
}


// Functional component to render a multi-select autocomplete with removable chips
const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps & { sx?: SxProps<Theme> }> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  disabled,
  loading,
  sx,
}) => {
  // State to control the open/close state of the dropdown
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Autocomplete
        multiple
        options={options}
        value={value}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        // Handle selection changes and close dropdown after selection
        onChange={(_, val, reason) => {
          onChange(val);
          if (reason === 'selectOption') setOpen(false);
        }}
        filterSelectedOptions
        disableCloseOnSelect
        loading={loading}
        disabled={disabled}
        renderTags={() => null}  // Hide tags inside input
        renderInput={params => (
          <TextField {...params} label={label} placeholder={placeholder} sx={{
            ...sx,
            mt:1,
            background: '#f3f3f4',
            borderRadius: 6,
            fontWeight: 500,
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              fontSize: 16,
              padding: '5px 8px',
              '& fieldset': {
                border: 'none',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
          }}
          />
        )}
        sx={{ mb: 1 }}
      />
      {/* Render selected options as removable chips below the input */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {value.map((option, index) => (
          <Chip
            key={option}
            label={option}
            onDelete={() => {
              // Remove the tag when close icon clicked
              const newValue = [...value];
              newValue.splice(index, 1);
              onChange(newValue);
            }}
            sx={{
              background: '#fff',
              color: '#000000',
              fontWeight: 500,
              border: '1px solid black',
              borderRadius: 6,
              px: 1,
              fontSize: 14,
            }}
          />
        ))}
      </Box>
    </Box>
  )
};


// Export the MultiSelectAutocomplete component as default
export default MultiSelectAutocomplete;