import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import '../../../../styles/Citizen/MyCityLandUseCard.css';

export type LandUseRegistration = {
  name: string;
  period?: string;
//   info?: string;
  type?: 'Residential' | 'Commercial' | string;
  date?: string;
//   description?: string;
};

const LandUseCard: React.FC<{ registration: LandUseRegistration | null | undefined }> = ({ registration }) => {
  if (!registration) return null;

  // Helper function to determine type class
  const getTypeClass = (type?: string): string => {
    if (type === 'Residential') return 'residential';
    if (type === 'Commercial') return 'commercial';
    return 'other';
  };

  const typeClass = getTypeClass(registration.type);
  
  return (
    <Paper className="luc-card" elevation={0} role="group" aria-label="Land use card">
      <div className="luc-top-row">
        <Typography className="luc-name" component="div">
          {registration.name}
        </Typography>
        <div className="luc-chip" aria-hidden="true">
          {registration.period}
        </div>
      </div>

      <div className="luc-type-row">
        <div className={`luc-tag ${typeClass}`} aria-hidden="true">
          <Typography className="luc-tag-text">{registration.type}</Typography>
        </div>
        {/* <InfoOutlinedIcon className="luc-info-icon" aria-hidden="true" /> */}
      </div>

      <div className="luc-meta-row">
        <Typography className="luc-meta-label">Registration Date:</Typography>
        <Typography className="luc-meta-value">{registration.date}</Typography>
      </div>
    </Paper>
  );
};

export default LandUseCard;