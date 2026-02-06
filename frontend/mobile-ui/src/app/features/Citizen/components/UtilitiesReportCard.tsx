// ...existing code...
import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import '../../../../styles/Citizen/UtilitiesReportCard.css';

type Props = {
  onTrack?: () => void;
  date?: string;
  id?: string;
  description?: string;
};

const PowerOutageCard: React.FC<Props> = ({ onTrack, date = '', id = '', description = '' }) => (
  <Paper className="po-card" elevation={0} role="group" aria-label="Power outage card">
    <Box className="po-row">
      <Box className="po-left">
        <Typography className="po-title">Power Outage</Typography>
        <Typography className="po-sub" component="div">{description}</Typography>
        <Typography className="po-id">{id}</Typography>

        {/* Submitted label and date - date rendered on the next line */}
        <div className="po-submitted-block" aria-hidden={false}>
          <Typography className="po-submitted">Submitted:</Typography>
          <Typography className="po-submitted-date">{date}</Typography>
        </div>
      </Box>

      <Box className="po-right">
        <Chip label="Resolved" className="po-chip" />
        <Button className="po-track-btn" onClick={onTrack} variant="contained">Track Status</Button>
      </Box>
    </Box>
  </Paper>
);

export default PowerOutageCard;
// ...existing code...