import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab
} from '@mui/material';

// Navigation Tab interface
interface NavigationTabItem {
  id: string;
  label: string;
  value: string;
}

interface NavigationTabsProps {
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

const mockNavigationTabs: NavigationTabItem[] = [
  {
    id: '1',
    label: 'Demand Collection',
    value: 'demand-collection'
  },
  {
    id: '2',
    label: 'Coverage',
    value: 'coverage'
  },
  {
    id: '3',
    label: 'KPI Dashboard',
    value: 'kpi-dashboard'
  },
  {
    id: '4',
    label: 'Reports',
    value: 'reports'
  }
];


const meta: Meta<typeof NavigationTabs> = {
  title: 'Commissioner Dashboard/NavigationTabs',
  component: NavigationTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Navigation Tabs component for switching between different dashboard sections with Material-UI styling.'
      }
    }
  },
  argTypes: {
    tabs: {
      description: 'Array of tab items to display',
    },
    defaultValue: {
      description: 'Default selected tab value',
    },
    onTabChange: {
      action: 'tab changed',
      description: 'Callback function called when tab is changed',
    }
  }
};

export default meta;
type Story = StoryObj<typeof NavigationTabs>;

// Basic Tab Stories
export const DefaultTabs: Story = {
  args: {
    tabs: mockNavigationTabs,
    defaultValue: 'demand-collection'
  }
};

