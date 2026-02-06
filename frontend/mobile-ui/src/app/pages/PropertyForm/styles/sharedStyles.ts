export const verifyButtonSx = {
  width: '46%',
  backgroundColor: '#c84c03',
  borderRadius: 2,
  color: '#FFFFFF',
  textTransform: 'none',
  fontSize: 16,
  fontWeight: 500,
  '&:hover': { backgroundColor: '#c84c03' },
};

export const uniformInputSx = {
  height: 30,
  minHeight: 30,
  boxSizing: 'border-box',
  mt: 0.15,
  '& input': {
    padding: '2px 8px 2px 16px', 
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: 2,
  },
  mb:2,
};

export const selectDropdownSx = {
  height: 30,
  minHeight: 30,
  boxSizing: 'border-box',
  '& input': {
    padding: '2px 8px', 
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: 2,
  },
  mb:2,
}