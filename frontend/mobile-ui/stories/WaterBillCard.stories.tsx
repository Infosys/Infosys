//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import WaterBillCard from '../src/app/features/Citizen/components/BillCard';

const meta: Meta<typeof WaterBillCard> = {
  title: 'Bills/Card',
  component: WaterBillCard,
};

export default meta;
type Story = StoryObj<typeof WaterBillCard>;

export const Default: Story = {
  args: {
    onReceipt: () => alert('Receipt clicked'),
  },
  render: (args) => (
    <Box sx={{ p: 4 }}>
      <WaterBillCard {...args} />
    </Box>
  ),
};