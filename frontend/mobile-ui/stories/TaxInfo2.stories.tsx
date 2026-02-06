//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import PropertyTaxCardExact from '../src/app/features/Citizen/components/PropertytaxCardwithBill';

const meta: Meta<typeof PropertyTaxCardExact> = {
  title: 'Bills/TaxInfo2',
  component: PropertyTaxCardExact,
};

export default meta;
type Story = StoryObj<typeof PropertyTaxCardExact>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <PropertyTaxCardExact />
    </Box>
  ),
};

export const Overdue: Story = {
  render: () => (
    <Box sx={{ p: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <PropertyTaxCardExact overdue />
    </Box>
  ),
};