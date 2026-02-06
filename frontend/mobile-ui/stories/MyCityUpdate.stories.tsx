//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import MetroUpdateCard, { type UpdateCard } from '../src/app/features/Citizen/components/MyCityUpdateCard';

const meta: Meta<typeof MetroUpdateCard> = {
  title: 'MyCity/MetroUpdateCard',
  component: MetroUpdateCard,
};

export default meta;
type Story = StoryObj<typeof MetroUpdateCard>;

const sampleUpdate: UpdateCard = {
  title: 'Metro Construction Update',
  description: 'HSR Layout Metro station work in progress. 27th Main Road partially closed till Nov 15.',
  date: 'Sept 13, 2025',
  icon: 'train'
};

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <MetroUpdateCard update={sampleUpdate} />
    </Box>
  ),
};

export const ConstructionUpdate: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <MetroUpdateCard 
        update={{
          title: 'Line 2 Extension Update',
          description: 'New metro line extension work starting from Dec 1. Temporary bus services available.',
          date: 'Dec 1, 2025',
          icon: 'construction'
        }}
      />
    </Box>
  ),
};

export const ServiceAlert: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <MetroUpdateCard 
        update={{
          title: 'Service Delay Notice',
          description: 'Minor delays expected during peak hours due to signal maintenance work.',
          date: 'Today',
          icon: 'info'
        }}
      />
    </Box>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <MetroUpdateCard update={sampleUpdate} />
      <MetroUpdateCard 
        update={{
          title: 'Purple Line Opening',
          description: 'New Purple Line stations now operational. Updated timings available.',
          date: 'Oct 15, 2025',
          icon: 'train'
        }}
      />
    </Box>
  ),
};