import type { Meta, StoryObj } from '@storybook/react';
// import React from 'react';
import { WardStatisticsCard, WardStatisticsDashboard } from '../Components/WardStatistics';
import type { WardStatistics } from '../Components/WardStatistics';

// Mock data based on your attachment
const mockWardStatistics: WardStatistics[] = [
  {
    wardNumber: 24,
    zoneName: 'Rajajinagar Zone',
    zoneCode: 'BBMP',
    zoneLocation: 'Zone 3 - West',
    pending: 5,
    approved: 19,
    rejected: 3,
    avgTime: '6 days'
  },
  {
    wardNumber: 38,
    zoneName: 'Bommanahalli Zone',
    zoneCode: 'BBMP',
    zoneLocation: 'Zone 6 - South',
    pending: 7,
    approved: 20,
    rejected: 2,
    avgTime: '4.6 days'
  },
  {
    wardNumber: 87,
    zoneName: 'Yelahanka Zone',
    zoneCode: 'BBMP',
    zoneLocation: 'Zone 2 - North',
    pending: 4,
    approved: 22,
    rejected: 2,
    avgTime: '4.8 days'
  }
];

// Storybook Meta
const meta: Meta<typeof WardStatisticsCard> = {
  title: 'Commissioner Dashboard/WardStatistics',
  component: WardStatisticsCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Ward Statistics component showing ward-level application statistics with pending, approved, rejected counts and average processing time using Material-UI styling.'
      }
    }
  },
  argTypes: {
    ward: {
      description: 'Ward statistics data object',
    }
  }
};

export default meta;

// List Stories
export const WardStatisticsList: StoryObj<typeof WardStatisticsDashboard> = {
  render: (args) => <WardStatisticsDashboard {...args} />,
  args: {
    wards: mockWardStatistics,
    title: "Jurisdiction"
  }
};