// Custom dropdown for IGRS details in property forms. Supports validation, placeholder, error display, and controlled open/close.

import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export type DropdownOption = { id: string | number; label: string };

interface CustomDropdownProps {
  label: string;
  name: string;
  value?: string;
  options: DropdownOption[];
  showDropdown: boolean;
  setShowDropdown: (b: boolean) => void;
  onSelect: (field: string, value: string) => void;
  closeOtherDropdowns?: () => void;
  selectText?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
}

// Style objects for dropdown and label
const containerSx = {
  width: '100%',
  marginBottom: '2px',
};

const labelSx = {
  fontSize: 14,
  fontWeight: 400,
  color: '#333333',
  marginBottom: '1.4px',
  textAlign: 'left' as const,
};

const formControlSx = {
  width: '100%',
  Height: '14px',
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
  },
};

const placeholderStyle: React.CSSProperties = {
  color: '#9E9E9E',
};

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
  onBlur,
}) => {
  // Ref to track if selection is happening (to distinguish blur from selection)
  const isSelectingRef = useRef(false);

  // Open dropdown and close others if needed
  const handleOpen = () => {
    if (closeOtherDropdowns) closeOtherDropdowns();
    setShowDropdown(true);
    isSelectingRef.current = false;
  };

  // Close dropdown and trigger blur if no selection
  const handleClose = () => {
    setShowDropdown(false);
    // Wait a brief moment to see if onChange fires (indicating a selection was made)
    setTimeout(() => {
      if (onBlur && !isSelectingRef.current) {
        onBlur();
      }
      isSelectingRef.current = false; // Reset for next time
    }, 0);
  };

  // Handle selection change
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    isSelectingRef.current = true; // Mark that selection is happening
    onSelect(name, selected);
    setShowDropdown(false);
  };

  // Use empty string if value is undefined
  const safeValue = value ?? '';

  // Render dropdown UI
  return (
    <Box sx={ containerSx } className="form-field">
      {/* Field label with required indicator */}
      <Typography component="label" sx={labelSx} className="field-label">
        {label}
        {required ? <span style={{ color: '#C8504B', marginLeft: 6 }}>*</span> : null}
        <span className="colon" style={{ marginLeft: 6 }}>
          :
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
          renderValue={(selected) => {
            if (!selected) {
              return <span style={placeholderStyle}>{selectText}</span>;
            }
            return (
              <Box
                component="span"
                title={selected}
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {selected}
              </Box>
            );
          }}
          inputProps={{ 'aria-label': label }}
          sx={{
            height: 48,
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              paddingTop: 0,
              paddingBottom: 0,
            },
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
            <MenuItem 
              key={opt.id} 
              value={opt.label} 
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#c84c0e',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#c84c0e',
                  },
                },
              }}
            >
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

// Export CustomDropdown for use in IGRS detail forms
export default CustomDropdown;
