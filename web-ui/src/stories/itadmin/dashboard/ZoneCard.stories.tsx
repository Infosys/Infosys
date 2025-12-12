import type { Meta, StoryObj } from '@storybook/react';
import { ZoneCard } from '../../../app/features/it-admin-app-features/components/ZoneCard';

const meta: Meta<typeof ZoneCard> = {
  title: 'ITAdmin/Dashboard/ZoneCard',
  component: ZoneCard,
  tags: ['autodocs'],
  argTypes: {
    zoneName: { control: 'text' },
    count: { control: 'text' },
    onViewDetails: { action: 'view-details-clicked' },
  },
};
export default meta;
type Story = StoryObj<typeof ZoneCard>;

export const ZoneA: Story = {
  args: {
    zoneName: 'Zone A',
    count: '12,450',
  },
};

export const ZoneB: Story = {
  args: {
    zoneName: 'Zone B',
    count: '15,320',
  },
};

export const ZoneC: Story = {
  args: {
    zoneName: 'Zone C',
    count: '10,180',
  },
};
