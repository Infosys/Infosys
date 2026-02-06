import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../../../../styles/Citizen/MyCityPropertyTransfer.css';

export type PropertyTransferData = {
  title: string;
  department: string;
  processingTime: string;
  officeLocation: string;
  contact: string;
  requiredDocuments: boolean;
  applyLink?: string;
};

type Props = {
  data: PropertyTransferData;
  onApply?: () => void;
  className?: string;
};

const PropertyTransferCard: React.FC<Props> = ({ data, onApply, className = '' }) => {
  return (
    <Paper 
      className={`pft-card ${className}`} 
      elevation={0}
      role="article"
      aria-label={`${data.title} service card`}
    >
      {/* Header */}
      <div className="pft-header">
        <Typography className="pft-title" component="h3">
          {data.title}
        </Typography>
        <Typography className="pft-department" component="p">
          {data.department}
        </Typography>
      </div>

      {/* Meta information */}
      <div className="pft-meta-row">
        <div className="pft-meta-col">
          <div className="pft-meta-label">Processing Time</div>
          <div className="pft-meta-value">{data.processingTime}</div>
        </div>
        
        <div className="pft-meta-col">
          <div className="pft-meta-label">Office Location</div>
          <div className="pft-meta-value">{data.officeLocation}</div>
        </div>
      </div>

      {/* Documents and contact */}
      <div className="pft-info-row">
        <div className="pft-left-info">
          {data.requiredDocuments && (
            <span className="pft-documents-badge" aria-label="Required documents needed">
              Required Documents
            </span>
          )}
        </div>
        
        <div className="pft-contact-info">
          <div className="pft-contact-label">Contact</div>
          <div className="pft-contact-value">{data.contact}</div>
        </div>
      </div>

      {/* Apply button */}
      <div className="pft-action-row">
        <Button
          className="pft-apply-btn"
          variant="contained"
          onClick={onApply}
          href={data.applyLink}
          aria-label={`Apply for ${data.title}`}
        >
          Apply Now
        </Button>
      </div>
    </Paper>
  );
};

export default PropertyTransferCard;