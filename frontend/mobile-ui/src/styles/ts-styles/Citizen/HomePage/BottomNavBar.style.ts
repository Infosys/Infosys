export const paperSx = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  bgcolor: '#fbe7db',
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  boxShadow: '0 -2px 8px rgba(0,0,0,0.07)',
  zIndex: 1000,
};

export const navActionSx = (selected: boolean) => ({
  color: selected ? 'black' : undefined,
  '&.Mui-selected': {
    color: 'black',
  },
});