import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import ChoosePropertyDropdownInline from '../src/app/features/Citizen/components/BillPropertyDropdown';

const meta: Meta<typeof ChoosePropertyDropdownInline> = {
  title: 'Bills/Dropdown',
  component: ChoosePropertyDropdownInline,
};

export default meta;
type Story = StoryObj<typeof ChoosePropertyDropdownInline>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <ChoosePropertyDropdownInline
        options={[
          { id: 'p1', title: 'Residential Property', subtitle: 'Plot 432, 24th Cross, HSR Layout Sector 2, Bengaluru' },
          { id: 'p2', title: 'Primary Residence', subtitle: 'Plot 567, 27th Main Road, HSR Layout Sector 1, Bengaluru' },
          { id: 'p3', title: 'Vacant Land', subtitle: '7th Sector, HSR Layout, Bengaluru, Karnataka' },
        ]}
      />
    </Box>
  ),
};