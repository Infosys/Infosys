//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import UrgentCard from '../src/app/features/Citizen/components/UrgentCard';

const meta: Meta<typeof UrgentCard> = {
  title: 'Citizen/Cards/UrgentCard',
  component: UrgentCard,
};

export default meta;
type Story = StoryObj<typeof UrgentCard>;

const immediate = { id: 'u1', type: 'immediate', status: 'pending', message: 'Property tax payment overdue', date: '2 days ago' } as any;
const info = { id: 'u2', type: 'info', status: 'resolved', message: 'New update available for property records', date: '10 Jan 2025' } as any;

export const Immediate: Story = {
  render: () => (
    <Box sx={{ width: 360, p: 4 }}>
      <UrgentCard item={immediate} />
    </Box>
  ),
};

export const Info: Story = {
  render: () => (
    <Box sx={{ width: 360, p: 4 }}>
      <UrgentCard item={info} />
    </Box>
  ),
};
