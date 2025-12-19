import type { Meta, StoryObj } from '@storybook/react';
import { UserStatsCard } from '../../../app/features/it-admin-app-features/components/UserStatsCard';

const meta: Meta<typeof UserStatsCard> = {
  title: 'ITAdmin/UserManagement/UserStatsCard',
  component: UserStatsCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    highlightColor: { control: 'color' },
  },
};
export default meta;
type Story = StoryObj<typeof UserStatsCard>;

export const TotalUsers: Story = {
  args: {
    title: 'Total Users',
    value: '1,018',
    highlightColor: '#000',
  },
};

export const ActiveUsers: Story = {
  args: {
    title: 'Active Users',
    value: '945',
    highlightColor: '#000',
  },
};

export const FieldAgents: Story = {
  args: {
    title: 'Field Agents',
    value: '890',
    highlightColor: '#000',
  },
};
