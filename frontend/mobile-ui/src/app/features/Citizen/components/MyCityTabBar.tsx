// ...existing code...
import React from 'react';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '../../../assets/Citizen/mycity_page/Icon.svg';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import '../../../../styles/Citizen/MyCityTabBar.css';

export type MyCityTabBarProps = {
  value?: number;
  onChange?: (index: number) => void;
  className?: string;
};

// Create a component wrapper for the SVG icon
const ServicesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src={SettingsIcon} alt="Services" className={className} />
);

const tabs = [
  { id: 0, label: 'Map', Icon: LocationOnIcon },
  { id: 1, label: 'Services', Icon: ServicesIcon },
  { id: 2, label: 'Updates', Icon: NotificationsNoneIcon },
];

const MyCityTabBar: React.FC<MyCityTabBarProps> = ({ value = 0, onChange, className = '' }) => {
  const handleClick = (index: number) => {
    onChange?.(index);
  };

  return (
    <Box className={`mct-wrapper ${className}`} role="tablist" aria-label="My City Tabs">
      {tabs.map((t) => {
        const selected = value === t.id;
        const IconComp = t.Icon;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`mct-tab ${selected ? 'mct-selected' : ''}`}
            onClick={() => handleClick(t.id)}
          >
            <span className="mct-icon-box" aria-hidden="true">
              <IconComp className="mct-icon" />
            </span>
            <span className="mct-label">{t.label}</span>
          </button>
        );
      })}
    </Box>
  );
};

export default MyCityTabBar;
