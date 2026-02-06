//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StepHeader from '../src/app/features/Agent/components/StepHeader';
import '../src/styles/Agent/StepHeader.css';

const meta: Meta<typeof StepHeader> = {
  title: 'Agent/StepHeader',
  component: StepHeader,
  tags: ['autodocs'],
  argTypes: {
    steps: { control: { type: 'number', min: 1, max: 12 } },
    activeStep: { control: { type: 'number', min: 0 } },
    onPrevious: { action: 'onPrevious' },
    onSaveDraft: { action: 'onSaveDraft' },
  },
};

export default meta;

type Story = StoryObj<typeof StepHeader>;

export const Default: Story = {
  args: {
    title: 'Create Property',
    subtitle: 'Fill in the property details to continue',
    steps: 6,
    activeStep: 0,
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    onPrevious: () => console.log('onPrevious'),
    onSaveDraft: () => console.log('onSaveDraft'),
  },
};

