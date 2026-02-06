import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import '../../../../styles/Citizen/BillCard.css';

type Props = {
  title?: string;
  addressLines?: string[];
  paidDate?: string;
  onReceipt?: () => void;
};

const WaterBillCard: React.FC<Props> = ({
  title = 'Water Bill',
  addressLines = ['Plot 567, 27th Main Road, HSR Layout', 'Sector 1, Bengaluru - 560102'],
  paidDate = 'Paid: March 14, 2025',
  onReceipt,
}) => {
  return (
    <Paper className="water-card" elevation={0} role="group" aria-label="Water bill card">
      <div className="water-left">
        <Typography className="water-title">{title}</Typography>
        <div className="water-address">
          {addressLines.map((line, i) => (
            <Typography key={`${line}-${i}`} className="water-address-line">
              {line}
            </Typography>
          ))}
        </div>
      </div>

      <div className="water-right">
        <Button
          onClick={onReceipt}
          startIcon={<VisibilityOutlinedIcon />}
          className="water-receipt-btn"
          variant="outlined"
        >
          Receipt
        </Button>

        <Typography className="water-paid-date">{paidDate}</Typography>
      </div>
    </Paper>
  );
};

export default WaterBillCard;