import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import BillListCard from '../src/app/features/Citizen/components/BillListCard';


const meta: Meta<typeof BillListCard> = {
  title: 'Bills/BillCard',
  component: BillListCard,
};

export default meta;
type Story = StoryObj<typeof BillListCard>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <BillListCard
        bills={[
          { id: 'b1', title: 'Water Bill', date: '26 JAN 2025', amount: '₹1,500' },
          { id: 'b2', title: 'Maintenance Bill', date: '17 JAN 2025', amount: '₹12,680' },
        ]}
      />
    </Box>
  ),
};
