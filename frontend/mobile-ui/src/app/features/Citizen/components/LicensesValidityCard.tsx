import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../../../styles/Citizen/LicensesValidityCard.css';

type Props = {
  daysRemaining?: number;
  issueDate?: string;
  expiryDate?: string;
  className?: string;
};

const ValidityCard: React.FC<Props> = ({
  daysRemaining = 174,
  issueDate = 'Jan 15, 2024',
  expiryDate = 'Jan 14, 2025',
  className = '',
}) => {
  return (
    <Paper className={`vc-card ${className}`} elevation={0} role="group" aria-label="Validity card">
      <Box className="vc-top">
        <Typography className="vc-title" component="div">
          Valid for {daysRemaining} days
        </Typography>
      </Box>

      <Box className="vc-body">
        <Box className="vc-left-col" aria-hidden={false}>
          <Typography className="vc-label">Issue Date:</Typography>
          <Typography className="vc-label">Expiry Date:</Typography>
        </Box>

        <Box className="vc-right-col" aria-hidden={false}>
          <Typography className="vc-date">{issueDate}</Typography>
          <Typography className="vc-date">{expiryDate}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ValidityCard;