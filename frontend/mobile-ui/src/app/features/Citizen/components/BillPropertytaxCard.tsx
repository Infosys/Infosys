import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import '../../../../styles/Citizen/BillPropertytaxCard.css';

type Props = {
  title?: string;
  price?: string;
  onViewLocation?: () => void;
  onPayNow?: () => void;
};

const PropertyTaxCard: React.FC<Props> = ({
  title = 'Property Tax',
  price = '₹12,500',
  onViewLocation,
  onPayNow,
}) => {
  return (
    <Paper className="ptc-card" elevation={0}>
      <div className="ptc-left-spacer" />

      <Box className="ptc-left-col">
        <Typography className="ptc-title-1">{title}</Typography>

        <Button
          onClick={onViewLocation}
          startIcon={<OpenInNewIcon className="ptc-open-icon" />}
          className="ptc-view-btn-1"
          variant="contained"
        >
          View Location
        </Button>
      </Box>

      <Box className="ptc-right-col">
        <Typography className="ptc-price-top-bill">{price}</Typography>

        <div className="ptc-middle-row">
          <div className="ptc-icon-row">
            <IconButton size="small" className="ptc-icon-btn" aria-label="view">
              <VisibilityOutlinedIcon className="visb" />
            </IconButton>
            <IconButton size="small" className="ptc-icon-btn" aria-label="download">
              <FileDownloadOutlinedIcon className="file"/>
            </IconButton>
          </div>

          <Button onClick={onPayNow} className="ptc-pay-btn" variant="contained">
            Pay Now
          </Button>
        </div>
      </Box>
    </Paper>
  );
};

export default PropertyTaxCard;