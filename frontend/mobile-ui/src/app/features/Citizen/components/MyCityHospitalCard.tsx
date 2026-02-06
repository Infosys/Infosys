import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealthCrossIcon from '../../../../app/assets/Citizen/mycity_page/health_cross.svg'; // Health cross icon
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
//import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../../../styles/Citizen/MyCityHospitalCard.css';

export type HospitalData = {
  name: string;
  description: string;
  openHours: string;
  status: string;
  onViewLocation?: () => void;
  locationLink?: string;
};

type Props = {
  hospital: HospitalData;
  className?: string;
};

const HospitalCard: React.FC<Props> = ({ hospital, className = '' }) => {
  return (
    <Paper 
      className={`hc-card ${className}`} 
      elevation={0}
      role="article"
      aria-label={`${hospital.name} hospital information`}
    >
      {/* Header with icon and name */}
      <div className="hc-header">
        <div className="hc-icon-title">
          <img 
            src={HealthCrossIcon} 
            alt="Health Cross" 
            className="hc-hospital-icon"
          />
          <Typography className="hc-name" component="h3">
            {hospital.name}
          </Typography>
        </div>
        <InfoOutlinedIcon className="hc-info-icon" aria-hidden="true" />
      </div>

      {/* Description */}
      <Typography className="hc-description" component="p">
        {hospital.description}
      </Typography>

      {/* Hours section */}
      <div className="hc-hours-section">
        <Typography className="hc-hours-label" component="div">
          Open Hours:
        </Typography>
        <Typography className="hc-hours-value" component="div">
          {hospital.status}
        </Typography>
      </div>

      {/* View location button */}
      <div className="hc-action-section">
        <Button
          className="hc-location-btn"
          startIcon={<OpenInNewIcon />}
          onClick={hospital.onViewLocation}
          href={hospital.locationLink}
          aria-label={`View location of ${hospital.name}`}
        >
          View Location
        </Button>
      </div>
    </Paper>
  );
};

export default HospitalCard;