import type { Meta, StoryObj } from '@storybook/react';
import { MapOverview } from '../../../src/app/features/it-admin-app-features/components/MapOverview';

const meta: Meta<typeof MapOverview> = {
  title: 'ITAdmin/Dashboard/MapOverview',
  component: MapOverview,
  tags: ['autodocs'],
  argTypes: {
    selectedZone: {
      control: 'select',
      options: ['Zone A', 'Zone B', 'Zone C'],
      description: 'Currently selected zone',
      defaultValue: 'Zone A',
    },
    mapImageUrl: { control: 'text' },
    searchValue: { control: 'text' },
    onViewMore: { action: 'view-more-clicked' },
    onSearchChange: { action: 'search-changed' },
  },
};
export default meta;
type Story = StoryObj<typeof MapOverview>;

export const Default: Story = {
  args: {
    selectedZone: 'Zone A',
    mapImageUrl: '',
    searchValue: '',
  },
};
