import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OpacityIcon from '../../../assets/Citizen/Utilities/humidity_low.svg'
import BoltIcon from '../../../assets/Citizen/Utilities/Icon.svg';
import deleteIcon from '../../../../assets/AgentAssets/delete.svg';
import '../../../../styles/Citizen/UtilitiesNavigationbar.css';

type Props = {
  value?: string;
  onChange?: (id: string) => void;
};

const items = [
  // { id: 'water', label: 'Water', icon: <OpacityIcon/> },
  { id: 'water', label: 'Water', icon: <img src={OpacityIcon} alt="WaterIcon" /> },
  { id: 'electricity', label: 'Electricity', icon: <img src={BoltIcon} alt="BoltIcon" /> },
  { id: 'sanitation', label: 'Sanitation', icon: <img src={deleteIcon} alt="sanitation" /> },
];

const XRNavigation: React.FC<Props> = ({ value = 'electricity', onChange }) => {
  return (
    <Paper className="xr" elevation={0}>
      <Box className="xr-row">
        {items.map((it) => {
          const selected = it.id === value;
          return (
            <Box key={it.id} className="xr-item">
              <IconButton
                onClick={() => onChange?.(it.id)}
                className={`xr-btn ${selected ? 'selected' : ''}`}
                aria-pressed={selected}
              >
                <span className="xr-icon-wrapper">{it.icon}</span>
              </IconButton>
              <Typography className="xr-label">{it.label}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default XRNavigation;