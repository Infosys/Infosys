// CustomDropdown is a reusable dropdown component for construction detail forms.
// It supports validation, custom styling, and controlled open/close behavior.
import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material';

// Option type for dropdown items
export type DropdownOption = { id: string | number; label: string };

// Props for the CustomDropdown component
interface CustomDropdownProps {
  label: string; // Field label
  name: string; // Field name (for form handling)
  value?: string; // Selected value
  options: DropdownOption[]; // List of dropdown options
  showDropdown: boolean; // Whether the dropdown is open
  setShowDropdown: (b: boolean) => void; // Function to control dropdown open state
  onSelect: (field: string, value: string) => void; // Callback when an option is selected
  // Called by the dropdown before opening so parent can close others
  closeOtherDropdowns?: () => void;
  selectText?: string; // Placeholder text
  required?: boolean; // Whether the field is required
  error?: string; // Error message (if any)
  touched?: boolean; // Whether the field has been touched
  sx?: SxProps<Theme>; // Custom styles
  // Called when dropdown is closed (used by parent to mark touched/validate)
  onBlur?: () => void;
}

// Style objects for dropdown and label
const containerSx = { width: '100%', mb: 2 };
const labelSx = {
  fontSize: 14,
  fontWeight: 400,
  color: '#333333',
  mb: '6px',
  textAlign: 'left' as const,
};
const formControlSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': { borderRadius: 2 },
};
const placeholderStyle: React.CSSProperties = { color: '#9E9E9E' };

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  name,
  value,
  options,
  showDropdown,
  setShowDropdown,
  onSelect,
  closeOtherDropdowns,
  selectText = 'Select',
  required = false,
  error,
  touched,
  sx,
  onBlur,
}) => {
  // Use empty string if value is undefined
  const safeValue = value ?? '';
  const justSelectedRef = useRef(false);

  // Open dropdown and close others if needed
  const handleOpen = () => {
    if (closeOtherDropdowns) closeOtherDropdowns();
    setShowDropdown(true);
  };

  // Close dropdown
  const handleClose = () => {
    // If the close is happening immediately after a selection, skip onBlur.
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      setShowDropdown(false);
      return;
    }

    if (onBlur) onBlur();
    setShowDropdown(false);
  };

  // Handle selection change
  const handleChange = (e: SelectChangeEvent<string>) => {
    const selected = e.target.value as string;
    // mark that the close that follows is caused by selection
    justSelectedRef.current = true;
    onSelect(name, selected);
    // close will be handled; we still call setShowDropdown(false) to make UI responsive
    setShowDropdown(false);
  };

  // Render dropdown UI
  return (
    <Box sx={{ ...containerSx, ...sx }} className="form-field">
      {/* Field label with required indicator */}
      <Typography component="label" sx={labelSx} className="field-label">
        {label}
        {required ? <span style={{ color: '#C8504B', marginLeft: 6 }}>*</span> : null}
        <span className="colon" style={{ marginLeft: 6 }}>
          :{' '}
        </span>
      </Typography>

      <FormControl variant="outlined" sx={formControlSx}>
        <Select
          displayEmpty
          open={showDropdown}
          onOpen={handleOpen}
          onClose={handleClose}
          value={safeValue}
          onChange={handleChange}
          renderValue={(selected) =>
            selected ? (
              (selected as string)
            ) : (
              <span style={placeholderStyle}>{selectText}</span>
            )
          }
          inputProps={{ 'aria-label': label }}
          sx={{
            ...(touched && error
              ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d32f2f' } }
              : {}),
          }}
        >
          {/* Placeholder option */}
          <MenuItem value="" disabled>
            <span style={placeholderStyle}>{selectText}</span>
          </MenuItem>
          {/* Render dropdown options */}
          {options.map((opt) => (
            <MenuItem key={opt.id} value={opt.label}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Error message display */}
      <div
        className="error-message"
        style={{
          minHeight: 20,
          color: '#D32F2F',
          visibility: touched && error ? 'visible' : 'hidden',
          marginTop: 4,
        }}
      >
        {touched && error ? error : '\u00A0'}
      </div>
    </Box>
  );
};

// Export CustomDropdown for use in construction detail forms
export default CustomDropdown;