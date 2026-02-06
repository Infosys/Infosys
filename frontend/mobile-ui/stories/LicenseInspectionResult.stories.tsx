//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import InspectionResultCard from '../src/app/features/Citizen/components/LicenseInspectionResult';

const meta: Meta<typeof InspectionResultCard> = {
  title: 'Licenses/InspectionResultCard',
  component: InspectionResultCard,
};



export default meta;
type Story = StoryObj<typeof InspectionResultCard>;


export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <InspectionResultCard />
    </Box>
  ),
};


export const CustomData: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <InspectionResultCard
        date="Date: Oct 11 2025"
        inspector="A. Kumar"
        bandge="FS-9999"
        result="Rejected - Follow up required"
      />
    </Box>
  ),
};

