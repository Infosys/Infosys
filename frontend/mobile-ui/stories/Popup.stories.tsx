import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Popup from '../src/app/components/Popup/Popup';

const meta: Meta<typeof Popup> = {
  title: 'Common/Popup',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof Popup>;

export const Information: Story = {
  args: {
    type: 'information',
    title: 'Information',
    message: 'This is an informational message.',
    open: true,
    duration: 4000,
  },
};

export const Alert: Story = {
  args: {
    type: 'alert',
    title: 'Alert',
    message: 'An important alert that needs your attention.',
    open: true,
    duration: 0, // keep open for demo
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    message: 'This is a warning message.',
    open: true,
    duration: 4000,
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success',
    message: 'Action completed successfully.',
    open: true,
    duration: 4000,
  },
};

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState<boolean>(!!args.open);
    return (
      <div>
        <button onClick={() => setOpen(true)} style={{ marginBottom: 12 }}>Show Popup</button>
        <Popup {...args} open={open} />
      </div>
    );
  },
  args: {
    type: 'information',
    title: 'Playground',
    message: 'Click the button to show the popup.',
    open: false,
    duration: 3000,
  },
};
