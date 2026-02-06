// ...existing code...
import React from 'react';
import Box from '@mui/material/Box';
import "../../../../styles/Citizen/LicenseStatusTab.css";
import CheckIcon from '@mui/icons-material/Check';

export type StatusTab = {
  id: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  tabs?: StatusTab[];
  value?: string;
  onChange?: (id: string) => void;
};

const defaultTabs: StatusTab[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'expired', label: 'Expired' },
];

const StatusTabs: React.FC<Props> = ({ tabs = defaultTabs, value, onChange }) => {
  const [selected, setSelected] = React.useState<string>(value ?? tabs[0].id);

  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleClick = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setSelected(id);
    onChange?.(id);
  };

  return (
    <Box className="st-tabs-root" role="tablist" aria-label="Status tabs">
      {tabs.map((t) => {
        const isSelected = selected === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isSelected}
            aria-disabled={t.disabled || false}
            className={`st-tab ${isSelected ? 'st-selected' : ''} ${t.disabled ? 'st-disabled' : ''}`}
            onClick={() => handleClick(t.id, t.disabled)}
            type="button"
          >
            {/* render icon first when selected, then the label */}
            <span className="st-tab-content">
              {isSelected && <CheckIcon className="st-tab-check-icon" aria-hidden="true" />}
              <span className="st-tab-label">{t.label}</span>
            </span>
          </button>
        );
      })}
    </Box>
  );
};

export default StatusTabs;
