import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import ErrorMessage from '../src/app/features/Citizen/components/ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Common/ErrorMessage',
  component: ErrorMessage,
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <ErrorMessage />
    </Box>
  ),
};
