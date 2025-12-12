// CardStatusSummary component displays a summary of application statuses for a ward
// Shows counts for pending, approved, and rejected applications, plus average processing time

import React from "react";
import { Box, Typography } from "@mui/material";
import {
  cardContainerStyles,
  cardHeaderRowStyles,
  wardZoneTextStyles,
  statusRowStyles,
  statusItemStyles,
  dividerStyles,
  pendingStyles,
  approvedStyles,
  rejectedStyles,
} from "../../Styles/CardsStyles/CardStatusSummaryStyles";

// Props for CardStatusSummary: ward label and status counts
interface CardStatusSummaryProps {
  wardLabel: string;
  pending: number;
  approved: number;
  rejected: number;
}

// Merge base and status-specific styles for each status box
const pendingStatusBoxStyles = { ...statusItemStyles, ...pendingStyles };
const approvedStatusBoxStyles = { ...statusItemStyles, ...approvedStyles };
const rejectedStatusBoxStyles = { ...statusItemStyles, ...rejectedStyles };

// CardStatusSummary functional component
const CardStatusSummary: React.FC<CardStatusSummaryProps> = ({
  wardLabel,
  pending,
  approved,
  rejected,
}) => (
  // Main card container
  <Box sx={cardContainerStyles}>
    {/* Header row with ward label and status summary */}
    <Box sx={cardHeaderRowStyles}>
      <Typography sx={wardZoneTextStyles}>{wardLabel}</Typography>
      <Box sx={statusRowStyles}>
        {/* Pending status box */}
        <Box sx={pendingStatusBoxStyles}>
          <Typography fontWeight={600} fontSize={18}>
            {pending}
          </Typography>
          <Typography fontSize={14}>Pending</Typography>
        </Box>
        {/* Approved status box */}
        <Box sx={approvedStatusBoxStyles}>
          <Typography fontWeight={600} fontSize={18}>
            {approved}
          </Typography>
          <Typography fontSize={14}>Approved</Typography>
        </Box>
        {/* Rejected status box */}
        <Box sx={rejectedStatusBoxStyles}>
          <Typography fontWeight={600} fontSize={18}>
            {rejected}
          </Typography>
          <Typography fontSize={14}>Rejected</Typography>
        </Box>
        {/* Average processing time (static for now) */}
        <Box>
          <Typography fontWeight={500}>
            6 days
          </Typography>
          <Typography noWrap>
            Avg. Time
          </Typography>
        </Box>
      </Box>
    </Box>
    {/* Divider line at the bottom of the card */}
    <Box sx={dividerStyles} />
  </Box>
);

export default CardStatusSummary;