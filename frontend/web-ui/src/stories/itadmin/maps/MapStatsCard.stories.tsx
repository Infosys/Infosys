import type { Meta, StoryObj } from '@storybook/react';
import { MapStatsCard } from '../../../app/features/it-admin-app-features/components/MapStatsCard';

const meta: Meta<typeof MapStatsCard> = {
  title: 'ITAdmin/MapConfiguration/MapStatsCard',
  component: MapStatsCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof MapStatsCard>;

export const TotalPropertiesMapped: Story = {
  args: {
    title: 'Total Properties Mapped',
    value: '42,891',
  },
};

export const PropertiesWithPolygons: Story = {
  args: {
    title: 'Properties with Polygons',
    value: '38,245',
  },
};

export const BoundaryCoverage: Story = {
  args: {
    title: 'Boundary Coverage',
    value: '198',
  },
};

export const CoordinateAccuracy: Story = {
  args: {
    title: 'Coordinate Accuracy',
    value: '95.2%',
  },
};
