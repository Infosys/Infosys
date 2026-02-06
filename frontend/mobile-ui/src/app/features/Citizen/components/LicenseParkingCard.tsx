import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import '../../../../styles/Citizen/LicenseParkingCard.css';

type Props = {
  title?: string;
  authority?: string;
  status?: string;
  amount?: string;
  onView?: () => void;
  onTrack?: () => void;
};

const ParkingLicenseCard: React.FC<Props> = ({
  title = 'Parking License',
  authority = 'Authority: BBMP Traffic and Transport Department',
  status = 'Pending',
  amount = '₹6,000',
  onView,
  onTrack,
}) => {
  return (
    <Paper className="pl-card" elevation={0} role="group" aria-label="Parking license card">
      <Box className="pl-top-row">
        <Box className="pl-top-left">
          <Typography className="pl-title">{title}</Typography>
          <Typography className="pl-authority">{authority}</Typography>
        </Box>

        <Box className="pl-top-right">
          <Box className="pl-status" role="status" aria-label={status}>
            <Typography className="pl-status-text">{status}</Typography>
            <AccessTimeOutlinedIcon className="pl-status-icon" />
          </Box>

          <Button
            className="pl-view-btn"
            aria-label="view application"
            onClick={onView}
            startIcon={<OpenInNewIcon />}
            size="small"
          >
            View Application
          </Button>
        </Box>
      </Box>

      <Box className="pl-separator" />

      <Box className="pl-bottom-strip" role="group" aria-label="payment and actions">
        <Box className="pl-amount-area">
          <Typography className="pl-amount-value">{amount}</Typography>
        </Box>

        <Box className="pl-action-area">
          <Button className="pl-track-btn" onClick={onTrack} size="small">
            Track Renewal
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ParkingLicenseCard;