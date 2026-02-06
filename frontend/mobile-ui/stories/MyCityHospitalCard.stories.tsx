import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import HospitalCard, { type HospitalData } from '../src/app/features/Citizen/components/MyCityHospitalCard';


const meta: Meta<typeof HospitalCard> = {
  title: 'MyCity/HospitalCard',
  component: HospitalCard,
};

export default meta;
type Story = StoryObj<typeof HospitalCard>;

const sampleHospital: HospitalData = {
  name: 'St. Francis Hospital',
  description: 'Multi-specialty hospital with 24/7 emergency services. COVID vaccination center available.',
  openHours: 'Open Hours:',
  status: 'Open 24 Hours',
  onViewLocation: () => alert('View Location clicked!'),
  locationLink: '#hospital-location'
};

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <HospitalCard hospital={sampleHospital} />
    </Box>
  ),
};

export const LimitedHours: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <HospitalCard 
        hospital={{
          ...sampleHospital,
          name: 'City Medical Center',
          description: 'General hospital with outpatient services and emergency care.',
          status: 'Open 8 AM - 10 PM',
        }}
      />
    </Box>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <HospitalCard hospital={sampleHospital} />
      <HospitalCard 
        hospital={{
          name: 'Apollo Hospital',
          description: 'Premium healthcare facility with advanced medical technology.',
          openHours: 'Open Hours:',
          status: 'Open 24 Hours',
          onViewLocation: () => {},
        }}
      />
    </Box>
  ),
};