import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import '../../../../styles/Citizen/CurrentBillCard.css';

const CurrentBillCard: React.FC = () => {
  return (
    <Paper className="current-bill-card" elevation={0} role="group" aria-label="Current bill card">
      <Box className="cbc-header">
        <Box className="cbc-account">
          <span className="cbc-account-chip">Account: BESCOM/HSR/24567890</span>
        </Box>

        <Box className="cbc-status">
          <Typography className="cbc-status-text">Active</Typography>
          <CheckCircleIcon className="cbc-status-icon" />
        </Box>
      </Box>

      <Box className="cbc-address-row">
        <Typography className="cbc-address">
          Plot 432, 24th Cross, HSR Layout Sector 2, Bengaluru - 560102
        </Typography>
        <button className="cbc-property-type" type="button">Residential</button>
      </Box>

      <Box className="cbc-details-strip">
        <Button className="cbc-view-btn" startIcon={<OpenInNewIcon className="cbc-open-icon" />}>
          View Details
        </Button>

        <Box className="cbc-consumption">
          <Typography className="cbc-consumption-label">Consumption</Typography>
          <Typography className="cbc-consumption-value">285 kWh</Typography>
        </Box>
      </Box>

      <Box className="cbc-footer">
        <Box>
          <Typography className="cbc-current-label">Current Bill</Typography>
          <Typography className="cbc-current-amount">₹2150</Typography>
        </Box>

        <Box className="cbc-footer-right">
          <Typography className="cbc-due">Due : 2024-10-20</Typography>
          <Button className="cbc-view-bills-btn">View Bills</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CurrentBillCard;