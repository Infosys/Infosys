import type { Meta, StoryObj } from '@storybook/react';
import { CalculationRuleCard } from '../../../src/app/features/it-admin-app-features/components/CalculationRuleCard';

const meta: Meta<typeof CalculationRuleCard> = {
  title: 'ITAdmin/DemandGeneration/CalculationRuleCard',
  component: CalculationRuleCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    formula: { control: 'text' },
    date: { control: 'text' },
    onEdit: { action: 'edit-clicked' },
  },
};
export default meta;
type Story = StoryObj<typeof CalculationRuleCard>;

export const AnnualPropertyTax: Story = {
  args: {
    title: 'Annual Property Tax Rate',
    formula: 'Formula: Base Rate × Area × Usage Factor + rebate - arrears\nBase Rate: ₹25/sq.ft, Usage Factor: 1.0-2.5',
    date: '20 Sept 2025 16:45',
  },
};

export const QuarterlyInflation: Story = {
  args: {
    title: 'Quarterly Inflation Adjustment',
    formula: 'Formula: Previous Tax × (1 + Inflation Rate)\nInflation Rate: 6.5% annually',
    date: '20 Sept 2025 16:45',
  },
};

export const PriorityManagement: Story = {
  args: {
    title: 'Priority Management - Enumeration',
    formula: 'Formula: >0 days from SLA date - Breach, <5\ndays to SLA - High, <15 days to SLA - Else - Low',
    date: '20 Sept 2025 16:45',
  },
};
