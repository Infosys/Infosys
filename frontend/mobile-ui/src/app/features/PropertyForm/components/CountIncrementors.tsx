// CountIncrementor component: input with increment/decrement buttons for numeric values
import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InputAdornment from '@mui/material/InputAdornment';

// Props for CountIncrementor: label, value, setter, min/max
interface CountIncrementorProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  required?: boolean;
  min?: number;
  max?: number;
}

// Main component for count increment/decrement input
const CountIncrementor: React.FC<CountIncrementorProps> = ({
  label,
  value,
  setValue,
  required = false,
  min = 0,
  max = 100,
}) => {
  // Handle manual input change in the text field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    if (val === '' || (val >= min && val <= max)) setValue(val === '' ? 0 : val);
  };

  // Increment value (up arrow)
  const inc = () => {
    if (value === 0 && min <= 1) setValue(1);
    else if (typeof value === 'number' && value < max) setValue(value + 1);
  };
  // Decrement value (down arrow)
  const dec = () => {
    if (typeof value === 'number' && value > min) setValue(value - 1);
    else if (value === 0 && min < 0) setValue(min);
  };

  // Render label, input, and increment/decrement buttons
  return (
    <Box display="flex" alignItems="start" flexDirection={'column'}>
      <Typography sx={{ fontSize: 14, fontWeight: 400, mb: 0.5 }}>
        {label}{required ? <span style={{ color: '#C8504B', marginLeft: 6 }}>*</span> : null} :
      </Typography>
      <TextField
        variant="outlined"
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={''}
        fullWidth
        size="medium"
        slotProps={{
          input: {
            inputProps: {
              min,
              max,
              style: { textAlign: 'start', fontSize: 16, fontWeight: 'light' },
            },
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  ml={0.5}
                >
                  <IconButton
                    size="small"
                    onClick={inc}
                    sx={{
                      p: 0,
                      mb: '-2px',
                    }}
                    disabled={typeof value === 'number' ? value >= max : false}
                    tabIndex={-1}
                  >
                    <ArrowDropUpIcon sx={{ fontSize: 24, color: '#222' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={dec}
                    sx={{
                      p: 0,
                    }}
                    disabled={typeof value === 'number' ? value <= min : false}
                    tabIndex={-1}
                  >
                    <ArrowDropDownIcon sx={{ fontSize: 24, color: '#222' }} />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          borderRadius: '8px',
          background: 'transparent',
          // remove default number input arrows
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          fontSize: 22,
          fontWeight: 400,
          color: '#b0b0b0',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            height: '48px',
            minWidth: '160px',
            fontSize: 14,
            bgcolor: 'transparent',
          },
          '&::placeholder': {
            fontSize: 20,
            color: '#b0b0b0',
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};

export default CountIncrementor;
