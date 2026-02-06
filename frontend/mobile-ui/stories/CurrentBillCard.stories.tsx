
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import CurrentBillCard from '../src/app/features/Citizen/components/CurrentBillCard';

const meta: Meta<typeof CurrentBillCard> = {
  title: 'Utilities/CurrentBill',
  component: CurrentBillCard,
};

export default meta;
type Story = StoryObj<typeof CurrentBillCard>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <CurrentBillCard />
    </Box>
  ),
};