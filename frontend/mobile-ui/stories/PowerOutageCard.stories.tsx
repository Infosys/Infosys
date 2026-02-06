//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import PowerOutageCard from '../src/app/features/Citizen/components/UtilitiesReportCard';

const meta: Meta<typeof PowerOutageCard> = {
  title: 'Utilities/ActiveReports',
  component: PowerOutageCard,
};

export default meta;
type Story = StoryObj<typeof PowerOutageCard>;

const sampleData = '2024-09-08';
const sampleId = 'SR003';
const sampleDescription = 'Frequent power cuts in the area';
export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <PowerOutageCard date={sampleData} id={sampleId} description={sampleDescription} onTrack={() => alert('Track Status clicked')} />
    </Box>
  ),
};