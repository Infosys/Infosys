//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import StatusTabs from '../src/app/features/Citizen/components/LicenseStatusTab';

const meta: Meta<typeof StatusTabs> = {
  title: 'Licenses/StatusTabs',
  component: StatusTabs,
};

export default meta;
type Story = StoryObj<typeof StatusTabs>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <StatusTabs />
    </Box>
  ),
};

export const WithSelection: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <StatusTabs value="pending" />
    </Box>
  ),
};