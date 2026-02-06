// ...existing code...
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import MyCityTabBar from '../src/app/features/Citizen/components/MyCityTabBar';

const meta: Meta<typeof MyCityTabBar> = {
  title: 'MyCity/TabBar',
  component: MyCityTabBar,
};

export default meta;
type Story = StoryObj<typeof MyCityTabBar>;

// Create a wrapper component that manages state properly
const InteractiveMyCityTabBar: React.FC = () => {
  const [value, setValue] = React.useState(0);
  
  return (
    <Box sx={{ p: 4 }}>
      <MyCityTabBar value={value} onChange={(v) => setValue(v)} />
    </Box>
  );
};

export const Default: Story = {
  render: () => <InteractiveMyCityTabBar />,
};

export const WithSelection: Story = {
  render: () => <MyCityTabBar value={1} onChange={() => {}} />,
};


