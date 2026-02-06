import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../../../../styles/Citizen/MyCityPropertytax.css';

type Props = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onCalculate?: () => void;
  className?: string;
};

const PropertyTaxCalculator: React.FC<Props> = ({
  title = 'Property Tax Calculator',
  subtitle = 'Tax calculator for any Property',
  buttonText = 'Calculate Now',
  onCalculate,
  className = '',
}) => {
  return (
    <Paper 
      className={`ptc-card ${className}`} 
      elevation={0} 
      role="group" 
      aria-label="Property tax calculator"
    >
      <div className="ptc-content">
        <Typography className="ptc-title" component="h3">
          {title}
        </Typography>
        
        <Typography className="ptc-subtitle" component="p">
          {subtitle}
        </Typography>
        
        <Button 
          className="ptc-button"
          variant="contained"
          onClick={onCalculate}
          aria-label="Calculate property tax"
        >
          {buttonText}
        </Button>
      </div>
    </Paper>
  );
};

export default PropertyTaxCalculator;