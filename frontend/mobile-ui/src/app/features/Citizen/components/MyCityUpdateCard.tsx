import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '../../../assets/Citizen/mycity_page/calendar_today.svg';
import GardenCartIcon from '../../../assets/Citizen/mycity_page/garden_cart.svg';
import '../../../../styles/Citizen/MyCityUpdateCard.css';

export type UpdateCard = {
  title: string;
  description: string;
  date: string;
  icon?: 'train' | 'construction' | 'info';
};

type Props = {
  update: UpdateCard;
  className?: string;
};

const MetroUpdateCard: React.FC<Props> = ({ update, className = '' }) => {
  const getIcon = () => {
    return <img src={GardenCartIcon} alt="Garden Cart" className="muc-main-icon" aria-hidden="true" />;
  };

  return (
    <Paper 
      className={`muc-card ${className}`} 
      elevation={0}
      role="article"
      aria-label={`Metro update: ${update.title}`}
    >
      {/* Header with icon and title */}
      <div className="muc-header">
        <div className="muc-icon-title">
          {getIcon()}
          <Typography className="muc-title" component="h3">
            {update.title}
          </Typography>
        </div>
        <InfoOutlinedIcon className="muc-info-icon" aria-hidden="true" />
      </div>

      {/* Description */}
      <Typography className="muc-description" component="p">
        {update.description}
      </Typography>

      {/* Date section */}
      <div className="muc-date-section">
        <img src={CalendarTodayIcon} alt="Calendar" className="muc-date-icon" aria-hidden="true" />
        <Typography className="muc-date" component="span">
          {update.date}
        </Typography>
      </div>
    </Paper>
  );
};

export default MetroUpdateCard;
