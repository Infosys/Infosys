import type { Meta, StoryObj } from '@storybook/react';
// import React from 'react';
import { PropertyTaxCalculator, PropertyTaxCalculatorList } from '../Components/PropertyTaxCalculator';
import type { PropertyTaxCalculatorCard } from '../Components/PropertyTaxCalculator';

// Mock data
const mockPropertyTaxCalculators: PropertyTaxCalculatorCard[] = [
  {
    id: '1',
    propertyName: 'Gandhi Nagar Complex',
    applicationId: 'BLR-2024-001',
    potentialDues: 10000.00,
    currency: '₹'
  },
  {
    id: '2',
    propertyName: 'Residential Villa',
    applicationId: 'BLR-2024-002',
    potentialDues: 25000.00,
    currency: '₹'
  },
  {
    id: '3',
    propertyName: 'Commercial Complex',
    applicationId: 'BLR-2024-003',
    potentialDues: 75000.00,
    currency: '₹'
  },
  {
    id: '4',
    propertyName: 'Apartment Building',
    applicationId: 'BLR-2024-004',
    potentialDues: 45000.00,
    currency: '₹'
  }
];

// Storybook Meta
const meta: Meta<typeof PropertyTaxCalculator> = {
  title: 'Commissioner Dashboard/PropertyTaxCalculator',
  component: PropertyTaxCalculator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Property Tax Calculator component showing property details, potential dues amount, and calculator access button using Material-UI styling.'
      }
    }
  },
  argTypes: {
    property: {
      description: 'Property tax calculator data object',
    }
  }
};

export default meta;
type Story = StoryObj<typeof PropertyTaxCalculator>;

// Individual Card Stories
export const GandhiNagarComplex: Story = {
  args: {
    property: mockPropertyTaxCalculators[0]
  }
};

export const ResidentialVilla: Story = {
  args: {
    property: mockPropertyTaxCalculators[1]
  }
};

// List Stories
export const PropertyCalculatorsList: StoryObj<typeof PropertyTaxCalculatorList> = {
  render: (args) => <PropertyTaxCalculatorList {...args} />,
  args: {
    properties: mockPropertyTaxCalculators,
    title: "Property Tax Calculators",
    onCalculatorClick: (id: string) => console.log('Calculate tax for property:', id)
  }
};