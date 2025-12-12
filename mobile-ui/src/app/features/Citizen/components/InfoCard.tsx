// InfoCard.tsx displays a styled card with a title and count for summary info on the Citizen dashboard.
// It uses MUI for UI and is used for showing counts (e.g., bills, licenses, etc.).
// Main responsibilities:
// - Render a card with title and count
// - Style card for dashboard summary
// Props:
//   title (string): label for the card
//   count (number): value to display
import React from 'react';
import { Typography, Paper } from '@mui/material';

// InfoCard component: renders a styled card with title and count
const InfoCard: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <Paper sx={{
    flex: 1,
    minWidth: 0,
    height: 76,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.2px solid  #c84c0e',
    borderRadius: 2,
    bgcolor: '#FBEEE8',
  }}>
    {/* Card title */}
    <Typography fontSize={14} textAlign="center" fontWeight={500}>{title}</Typography>
    {/* Card count value */}
    <Typography fontSize={28} fontWeight={500}>{count}</Typography>
  </Paper>
);

// Export InfoCard for use in dashboard summary sections
export default InfoCard;