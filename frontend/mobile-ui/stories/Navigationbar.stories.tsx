import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import XRNavigation from '../src/app/features/Citizen/components/UtilitiesNavigationbar';

const meta: Meta<typeof XRNavigation> = {
  title: 'Utilities/Navigationbar',
  component: XRNavigation,
};

export default meta;
type Story = StoryObj<typeof XRNavigation>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('electricity');
    return (
      <Box sx={{ p: 4 }}>
        <XRNavigation value={value} onChange={setValue} />
      </Box>
    );
  },
};