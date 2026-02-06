//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import ParkingLicenseCard from '../src/app/features/Citizen/components/LicenseParkingCard';

const meta: Meta<typeof ParkingLicenseCard> = {
  title: 'Licenses/ParkingLicenseCard',
  component: ParkingLicenseCard,
};

export default meta;
type Story = StoryObj<typeof ParkingLicenseCard>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <ParkingLicenseCard
        onView={() => alert('View Application')}
        onTrack={() => alert('Track Renewal')}
      />
    </Box>
  ),
};