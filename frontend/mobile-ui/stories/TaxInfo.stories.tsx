// ...existing code...

import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import PropertyTaxCard from '../src/app/features/Citizen/components/BillPropertytaxCard';

const meta: Meta<typeof PropertyTaxCard> = {
  title: 'Bills/TaxInfo',
  component: PropertyTaxCard,
};

export default meta;
type Story = StoryObj<typeof PropertyTaxCard>;

export const Default: Story = {
  args: {
    title: 'Property Tax',
    price: '₹12,500',
    onViewLocation: () => alert('View Location clicked'),
    onPayNow: () => alert('Pay Now clicked'),
  },
  render: (args) => (
    <Box sx={{ p: 4 }}>
      <PropertyTaxCard {...args} />
    </Box>
  ),
};
