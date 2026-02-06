import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from '../../../src/app/features/it-admin-app-features/components/StatsCard';
// import type { StatsCardProps } from './StatsCard';

const meta: Meta<typeof StatsCard> = {
  title: 'ITAdmin/Dashboard/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    subtext: { control: 'text' },
    highlightColor: { control: 'color' },
  },
};
export default meta;
type Story = StoryObj<typeof StatsCard>;

export const TotalProperties: Story = {
  args: {
    title: 'Total Properties',
    value: '45,231',
    subtext: '+2.17% this week',
    highlightColor: '#C84C0E',
  },
};

export const MappedProperties: Story = {
  args: {
    title: 'Mapped Properties',
    value: '42,891',
    subtext: '94.8% coverage',
    highlightColor: '#C84C0E',
  },
};

export const ActiveUsers: Story = {
  args: {
    title: 'Active Users',
    substats: [
      { value: '87,065', label: 'Citizens Registered' },
      { value: '890', label: 'Field Agents' },
      { value: '48', label: 'Service Managers' },
    ],
    highlightColor: '#C84C0E',
    width: 420,
  },
};
