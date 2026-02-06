import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab
} from '@mui/material';

export interface NavigationTabItem {
  id: string;
  label: string;
  value: string;
}

export interface NavigationTabsProps {
  tabs?: NavigationTabItem[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs = [],
  defaultValue,
  onTabChange
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue || tabs[0]?.value || '');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        sx={{
          minHeight: '48px',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer': {
            gap: 0,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: '#0B4B66',
            backgroundColor: '#f1f5f9',
            borderRadius: 0,
            minHeight: '48px',
            padding: '12px 24px',
            border: 'none',
            '&:first-of-type': {
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
            },
            '&:last-of-type': {
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
            },
            '&.Mui-selected': {
              color: 'white',
              backgroundColor: '#0B4B66',
              fontWeight: 600,
            },
            '&:hover': {
              backgroundColor: selectedTab === tabs.find(tab => tab.value === selectedTab)?.value
                ? '#0B4B66'
                : '#e2e8f0',
            },
            transition: 'all 0.2s ease-in-out',
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default NavigationTabs;