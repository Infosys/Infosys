import type { Meta, StoryObj } from '@storybook/react';
import { RoleCard } from '../../../src/app/features/it-admin-app-features/components/RoleCard';

const meta: Meta<typeof RoleCard> = {
  title: 'ITAdmin/AccessControl/RoleCard',
  component: RoleCard,
  tags: ['autodocs'],
  argTypes: {
    role: { control: 'text' },
    description: { control: 'text' },
    userCount: { control: 'number' },
    userLabel: { control: 'text' },
    levelTag: { control: 'text' },
    requestCount: { control: 'number' },
    requestLabel: { control: 'text' },
    selected: { control: 'boolean' },
    onEdit: { action: 'edit-clicked' },
  },
};
export default meta;
type Story = StoryObj<typeof RoleCard>;

export const SuperAdmin: Story = {
  args: {
    role: 'Super Admin',
    description: 'Full system access',
    userCount: 5,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 1,
    requestLabel: 'Request',
    selected: true,
  },
};

export const FieldAgent: Story = {
  args: {
    role: 'Field Agent',
    description: 'Property verification',
    userCount: 890,
    userLabel: 'users',
    levelTag: 'ward level',
    requestCount: 7,
    requestLabel: 'Requests',
    selected: false,
  },
};

export const ServiceManager: Story = {
  args: {
    role: 'Service Manager',
    description: 'Property tax management',
    userCount: 15,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 1,
    requestLabel: 'Request',
    selected: false,
  },
};

export const GISAdmin: Story = {
  args: {
    role: 'GIS Admin',
    description: 'Map data management',
    userCount: 5,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 4,
    requestLabel: 'Requests',
    selected: false,
  },
};
