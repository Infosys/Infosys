import type { SxProps, Theme } from "@mui/material";

export const applicationInboxPropertyCardListSx: SxProps<Theme> = {
  maxHeight: "60vh",
  overflowY: "auto",
  background: "#ffffff",
  borderRadius: "0",
  py: 0,
  pl: 2,
  pr: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  '&::-webkit-scrollbar': {
    width: '6px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c84c03',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
};