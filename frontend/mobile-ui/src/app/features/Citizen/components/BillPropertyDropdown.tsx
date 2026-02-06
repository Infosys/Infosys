// ...existing code...
import React from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../../../../styles/Citizen/ChoosePropertyDropdown.css';

export type PropertyOption = {
  id: string;
  title: string;
  subtitle?: string;
  address?: string;
};

const EmptyIcon: React.FC = () => <span style={{ width: 0 }} />;

const ChoosePropertyDropdownInline: React.FC<{
  options: PropertyOption[];
  value?: string;
  onChange?: (id: string) => void;
}> = ({ options, value = '', onChange}) => {
  const handleChange = (e: any) => onChange?.(e.target.value);
  return (
    <Box className="choose-dropdown">
      <div className="choose-paper">
        <Select
          fullWidth
          value={value}
          displayEmpty
          onChange={handleChange}
          IconComponent={EmptyIcon}
          renderValue={(selected) => {
            const opt = options.find((o) => o.id === selected);
            if (!opt) return null; /* removed placeholder display */
            return (
              <div className="selected-value">
                <div className="selected-title">{opt.title}</div>
                {opt.subtitle && <div className="selected-subtitle">{opt.subtitle}</div>}
              </div>
            );
          }}
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            transformOrigin: { vertical: 'top', horizontal: 'left' },
            PaperProps: {
              className: 'choose-menu-paper',
              style: { marginTop: 0, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }
            },
            MenuListProps: { className: 'choose-menu-list' },
          }}
          className="choose-select"
          variant="standard"
        >
          {options.map((opt) => (
            <MenuItem key={opt.id} value={opt.id} className="choose-menu-item">
              <div className="menu-item-content">
                <div className="menu-title">{opt.title}</div>
                {opt.subtitle && <div className="menu-subtitle">{opt.subtitle}</div>}
              </div>
            </MenuItem>
          ))}
        </Select>
      </div>
    </Box>
  );
};

export default ChoosePropertyDropdownInline;