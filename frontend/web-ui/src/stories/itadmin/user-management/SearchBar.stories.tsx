import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../../../app/features/it-admin-app-features/components/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'ITAdmin/UserManagement/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'search-changed' },
  },
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Search by name, ID, or email',
  },
};
