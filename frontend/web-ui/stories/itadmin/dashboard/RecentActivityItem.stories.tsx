import type { Meta, StoryObj } from '@storybook/react';
import { RecentActivityItem } from '../../../src/app/features/it-admin-app-features/components/RecentActivityItem';
import { FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';

const meta: Meta<typeof RecentActivityItem> = {
  title: 'ITAdmin/Dashboard/RecentActivityItem',
  component: RecentActivityItem,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    label: { control: 'text' },
    subtext: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof RecentActivityItem>;


export const UserActivity: Story = {
  args: {
    icon: <FaUserAlt color="#23506a" size={18} />,
    label: 'User Registered',
    subtext: 'Rajesh Kumar registered as Field Agent',
    hoursAgo: '2 hours ago',
  },
};


export const MapActivity: Story = {
  args: {
    icon: <FaMapMarkerAlt color="#23506a" size={18} />,
    label: 'Zone Updated',
    subtext: 'Zone B boundaries updated',
    hoursAgo: '1 hour ago',
  },
};
