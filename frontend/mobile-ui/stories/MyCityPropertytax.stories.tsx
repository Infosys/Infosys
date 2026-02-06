// import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import PropertyTaxCalculator from '../src/app/features/Citizen/components/MyCityPropertyTax';

const meta: Meta<typeof PropertyTaxCalculator> = {
  title: 'MyCity/PropertyTaxCalculator',
  component: PropertyTaxCalculator,
};

export default meta;
type Story = StoryObj<typeof PropertyTaxCalculator>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <PropertyTaxCalculator 
        onCalculate={() => alert('Calculate button clicked!')}
      />
    </Box>
  ),
};

export const CustomText: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <PropertyTaxCalculator 
        title="Tax Estimator"
        subtitle="Get instant tax estimates for your property"
        buttonText="Start Calculation"
        onCalculate={() => alert('Custom calculate clicked!')}
      />
    </Box>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <PropertyTaxCalculator onCalculate={() => {}} />
      <PropertyTaxCalculator 
        title="Quick Calculator"
        subtitle="Fast property tax estimation"
        buttonText="Get Quote"
        onCalculate={() => {}}
      />
    </Box>
  ),
};