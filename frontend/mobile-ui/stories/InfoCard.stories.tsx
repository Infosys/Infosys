//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import InfoCard from '../src/app/features/Citizen/components/InfoCard';

const meta: Meta<typeof InfoCard> = {
  title: 'Citizen/Cards/InfoCard',
  component: InfoCard,
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {
  render: () => (
    <Box sx={{ width: 360, p: 4 }}>
      <InfoCard title="Active Bills" count={5} />
    </Box>
  ),
};

export const Zero: Story = {
  render: () => (
    <Box sx={{ width: 360, p: 4 }}>
      <InfoCard title="Pending Licenses" count={0} />
    </Box>
  ),
};

export const LargeCount: Story = {
  render: () => (
    <Box sx={{ width: 360, p: 4 }}>
      <InfoCard title="Total Properties" count={128} />
    </Box>
  ),
};
