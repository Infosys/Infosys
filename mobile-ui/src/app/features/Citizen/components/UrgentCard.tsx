// UrgentCard.tsx
// This component displays a notification card for urgent attention items in the citizen UI.
// Highlights immediate/pending items with a distinct color and icon.
// Props:
//   item: UrgentAttention object containing type, status, message, and date
// Used in: Lists or sections showing urgent notifications to the user

import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import type { UrgentAttention } from '../models/UrgentAttention.model';

const UrgentCard: React.FC<{ item: UrgentAttention }> = ({ item }) => {
  // Determine if the item requires immediate attention (type or status)
  const isImmediate = item.type === 'immediate' || item.status === 'pending';
  return (
    <Box
      sx={{
        // Set background color based on urgency
        bgcolor: isImmediate ? '#FFEAE2' : '#E2FFF0',
        borderRadius: 1,
        p: 2,
        my: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Notification icon with color based on urgency */}
      <NotificationsNoneIcon sx={{ color: isImmediate ? '#c84c0e' : '#3c9450', fontSize: 22 }} />
      {/* Notification message */}
      <Typography sx={{ color: isImmediate ? '#c84c0e' : '#3c9450', fontWeight: 500, fontSize: 12, flex: 1, ml: 2 }}>{item.message}</Typography>
      {/* Notification date */}
      <Typography sx={{ color: 'grey.600', fontWeight: 500, fontSize: 10, ml: 2 }}>{item.date}</Typography>
    </Box>
  );
};

// Export UrgentCard for use in urgent notification lists
export default UrgentCard;