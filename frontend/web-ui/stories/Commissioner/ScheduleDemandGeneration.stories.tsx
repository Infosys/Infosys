import type { Meta, StoryObj } from '@storybook/react';
import ScheduleDemandGeneration from '../Components/ScheduleDemandGeneration';

// Storybook Meta
const meta: Meta<typeof ScheduleDemandGeneration> = {
  title: 'Commissioner Dashboard/ScheduleDemandGeneration',
  component: ScheduleDemandGeneration,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Schedule Demand Generation component with search input and generate button using Material-UI styling.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed at the top of the component',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input field',
    },
    buttonText: {
      control: 'text',
      description: 'Text displayed on the generate button',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback function called when search input changes',
    },
    onGenerate: {
      action: 'generated',
      description: 'Callback function called when generate button is clicked',
    }
  }
};

export default meta;
type Story = StoryObj<typeof ScheduleDemandGeneration>;

// Individual Component Stories
export const Default: Story = {
  args: {
    title: "Schedule Demand Generation",
    searchPlaceholder: "Search Jurisdiction",
    buttonText: "Generate"
  }
};