
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import LandUseCard, { type LandUseRegistration } from '../src/app/features/Citizen/components/MyCityLandUseCard';

const meta: Meta<typeof LandUseCard> = {
  title: 'MyCity/LandUseCard',
  component: LandUseCard,
};

export default meta;
type Story = StoryObj<typeof LandUseCard>;

const sample: LandUseRegistration = {
  name: 'Residential Zone A',
  period: '2020 - 2030',
//   info: 'Plan reference: LUP-2020/34',
  type: 'Residential',
  date: '05-11-2002',
//   description: 'Area designated for low-density residential development.',
};

const commercial: LandUseRegistration = {
  name: 'Commercial Zone A',
  period: '2020 - 2030',
//   info: 'Plan reference: LUP-2020/34',
  type: 'Commercial',
  date: '05-11-2002',
//   description: 'Area designated for low-density residential development.',
};

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 420 }}>
      <LandUseCard registration={sample} />
    </Box>
  ),
};

export const Commercial: Story = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 420 }}>
      <LandUseCard registration={commercial} />
    </Box>
  ),
};