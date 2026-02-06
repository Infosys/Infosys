import type { Meta, StoryObj } from '@storybook/react';
import { FilterDropdown } from '../../../src/app/features/it-admin-app-features/components/FilterDropdown';

const meta: Meta<typeof FilterDropdown> = {
  title: 'ITAdmin/UserManagement/FilterDropdown',
  component: FilterDropdown,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    options: { control: 'object' },
    value: { control: 'text' },
    onChange: { action: 'filter-changed' },
  },
};
export default meta;
type Story = StoryObj<typeof FilterDropdown>;

export const Status: Story = {
  args: {
    label: 'Status',
    options: ['All Status', 'Active', 'Inactive'],
    value: 'All Status',
  },
};

export const Roles: Story = {
  args: {
    label: 'Role',
    options: ['All Roles', 'Tax Officer', 'GIS Admin', 'Verifier', 'Data Entry'],
    value: 'All Roles',
  },
};
