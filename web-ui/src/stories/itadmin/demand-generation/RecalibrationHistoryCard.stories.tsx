import type { Meta, StoryObj } from '@storybook/react';
import { RecalibrationHistoryCard } from '../../../app/features/it-admin-app-features/components/RecalibrationHistoryCard';

const meta: Meta<typeof RecalibrationHistoryCard> = {
  title: 'ITAdmin/DemandGeneration/RecalibrationHistoryCard',
  component: RecalibrationHistoryCard,
  tags: ['autodocs'],
  argTypes: {
    period: { control: 'text' },
    triggeredBy: { control: 'text' },
    date: { control: 'text' },
    properties: { control: 'text' },
    avgChange: { control: 'text' },
    duration: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof RecalibrationHistoryCard>;

export const Q42024: Story = {
  args: {
    period: 'Q4 2024',
    triggeredBy: 'Rajesh Kumar',
    date: '2024-10-01',
    properties: '45,231',
    avgChange: '+8.5%',
    duration: '2h 34m',
  },
};

export const Q32024: Story = {
  args: {
    period: 'Q3 2024',
    triggeredBy: 'System Auto',
    date: '2024-07-01',
    properties: '44,890',
    avgChange: '+6.2%',
    duration: '2h 18m',
  },
};

export const Q22024: Story = {
  args: {
    period: 'Q2 2024',
    triggeredBy: 'Priya Sharma',
    date: '2024-04-01',
    properties: '44,890',
    avgChange: '+6.2%',
    duration: '2h 45m',
  },
};
