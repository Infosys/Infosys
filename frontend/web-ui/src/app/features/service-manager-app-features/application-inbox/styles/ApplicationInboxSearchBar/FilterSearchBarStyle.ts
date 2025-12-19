import type { SxProps, Theme } from "@mui/material";

export const searchInputSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F5F5',
    borderRadius: '20px',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#E0E0E0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C84C03',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
  },
};