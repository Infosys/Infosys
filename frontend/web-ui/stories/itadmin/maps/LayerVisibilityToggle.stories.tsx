import type { Meta, StoryObj } from '@storybook/react';
import  { useState } from 'react';
import { LayerVisibilityToggle } from '../../../src/app/features/it-admin-app-features/components/LayerVisibilityToggle';

const meta: Meta<typeof LayerVisibilityToggle> = {
  title: 'ITAdmin/MapConfiguration/LayerVisibilityToggle',
  component: LayerVisibilityToggle,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'toggled' },
  },
};
export default meta;
type Story = StoryObj<typeof LayerVisibilityToggle>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return (
      <LayerVisibilityToggle
        {...args}
        checked={checked}
        onChange={(val) => {
          setChecked(val);
          args.onChange?.(val);
        }}
      />
    );
  },
  args: {
    checked: true,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};
