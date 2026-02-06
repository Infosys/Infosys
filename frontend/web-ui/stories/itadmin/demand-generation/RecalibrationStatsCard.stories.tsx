import type { Meta, StoryObj } from '@storybook/react';
import { RecalibrationStatsCard } from '../../../src/app/features/it-admin-app-features/components/RecalibrationStatsCard';

const meta: Meta<typeof RecalibrationStatsCard> = {
  title: 'ITAdmin/DemandGeneration/RecalibrationStatsCard',
  component: RecalibrationStatsCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    subtext: { control: 'text' },
    highlightColor: { control: 'color' },
  },
};
export default meta;
type Story = StoryObj<typeof RecalibrationStatsCard>;

export const TotalRecalibrations: Story = {
  args: {
    title: 'Total Recalibrations',
    value: '12',
    highlightColor: '#00',
  },
};

export const LastRecalibration: Story = {
  args: {
    title: 'Last Recalibration',
    value: 'Oct 1, 2024',
    highlightColor: '#000',
  },
};

export const ActiveRules: Story = {
  args: {
    title: 'Active Rules',
    value: '3',
    highlightColor: '#000',
  },
};

export const AvgProcessingTime: Story = {
  args: {
    title: 'Avg. Processing Time',
    value: '2h 28m',
    highlightColor: '#000',
  },
};
