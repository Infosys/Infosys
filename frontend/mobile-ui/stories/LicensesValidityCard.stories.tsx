//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import ValidityCard from '../src/app/features/Citizen/components/LicensesValidityCard';

const meta: Meta<typeof ValidityCard> = {
  title: 'Licenses/ValidityCard',
  component: ValidityCard,
};

export default meta;
type Story = StoryObj<typeof ValidityCard>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <ValidityCard daysRemaining={174} issueDate="Jan 15, 2024" expiryDate="Jan 14, 2025" />
    </Box>
  ),
};