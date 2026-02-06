import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../../../styles/Citizen/LicenseInspectionResult.css';

type Props = {
  title?: string;
  date?: string;
  inspector?: string;
  bandge?: string;
  result?: string;
};

const InspectionResultCard: React.FC<Props> = ({
  title = 'Last Inspection:',
  date = 'Date: July 15 2024',
  inspector = 'L. Ramesh',
  bandge = 'FS-2341',
  result = 'Approved - All Requirements Met',
}) => {
  return (
    <Paper className="irc-card" elevation={0} role="group" aria-label="Inspection result">
      <Box className="irc-header">
        <Typography className="irc-title">{title}</Typography>
        <Typography className="irc-date" component="div">{date}</Typography>
      </Box>

      <Box className="irc-body">
        <Box className="irc-row">
          <Typography className="irc-label">Inspector :</Typography>
          <Typography className="irc-value">{inspector}</Typography>
          <Typography className="irc-bandge">({`Bandge : ${bandge}`})</Typography>
        </Box>

        <Box className="irc-row irc-result-row" aria-live="polite">
          <Typography className="irc-label-result">Result :</Typography>
          <Typography className="irc-result-value">{result}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default InspectionResultCard;