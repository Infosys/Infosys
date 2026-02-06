import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from '../../../src/app/features/it-admin-app-features/components/ActionButton';
import { FiPlus } from 'react-icons/fi';

const meta: Meta<typeof ActionButton> = {
  title: 'ITAdmin/DemandGeneration/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    color: { control: 'color' },
    background: { control: 'color' },
    onClick: { action: 'clicked' },
    icon: { control: false },
    style: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof ActionButton>;

export const AddRuleButton: Story = {
  args: {
    label: 'Add New Rule',
    background: '#fff',
    color: '#F26B1A',
    icon: <FiPlus size={16} color="#F26B1A" style={{ marginRight: 4 }} />, // icon left, orange
    style: {
      border: '1.5px solid #eb5e07ff',
      fontWeight: 500,
      fontSize: 14,
      padding: '6px 14px',
      boxShadow: 'none',
    },
  },
};

export const TriggerButton: Story = {
  args: {
    label: 'Trigger Recalibration',
    background: '#eb5e07ff',
    color: '#fff',
    icon: <FiPlus size={18} />,
  },
};
