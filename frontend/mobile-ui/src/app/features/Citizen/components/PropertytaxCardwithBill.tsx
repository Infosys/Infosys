import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalendarMonth from '@mui/icons-material/CalendarMonthOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';


import Location from '../../../../../stories/assets/distance.png';
import '../../../../styles/Citizen/PropertytaxCardwithBill.css';

type Props = {
  overdue?: boolean;
};

const PropertyTaxCardExact: React.FC<Props> = ({ overdue = false }) => {
  return (
    <Paper
      className={`pt-card ${overdue ? 'pt-overdue' : ''}`}
      elevation={0}
      role="group"
      aria-label="Property tax card"
    >
      <Box className="pt-header">
        <Box>
          <Typography className="pt-title">Property Tax</Typography>
        </Box>

        <Box className="pt-amount-block">
          <Typography className="pt-price-property">₹12,500</Typography>
          <Button className="pt-pay-btn" variant="contained" size="small">
            Pay Now
          </Button>
        </Box>
      </Box>

      <Box className="pt-address-block">
        <Box className="pt-address-left">
          <img src={Location} alt="location" className="pt-location-icon" />
        </Box>
        <Box className="pt-address-text">
          <Typography className="pt-address-line">
            Plot 567, 27th Main Road,
            <br />
            HSR Layout Sector 1,
            <br />
            Bengaluru - 560102
          </Typography>
        </Box>
      </Box>

      <Box className="pt-action-row">
        <Button className="pt-view-btn" variant="contained" size="small" startIcon={<OpenInNewIcon />}>
          View Location
        </Button>

        <Button className="pt-receipt-btn" variant="outlined" size="small" startIcon={<FileDownloadOutlinedIcon />}>
          Receipt
        </Button>
      </Box>

      <Paper className="pt-due-strip" elevation={0}>
        <Box className="pt-due-left">
          <CalendarMonth className="pt-calendar-icon" />
          <Box>
            <Typography className="pt-due-title">Due: Sept 14, 2025</Typography>
            <Typography className="pt-due-sub">Payment overdue</Typography>
          </Box>
        </Box>

        <Box className="pt-info-col">
          <ErrorOutline className="pt-error-icon" />
          <Typography className="pt-info-text">Info</Typography>
        </Box>
      </Paper>
    </Paper>
  );
};

export default PropertyTaxCardExact;