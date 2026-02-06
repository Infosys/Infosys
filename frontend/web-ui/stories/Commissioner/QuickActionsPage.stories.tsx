import type { Meta, StoryObj } from '@storybook/react';
// import React from 'react';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlaceIcon from '@mui/icons-material/Place';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { QuickActions, QuickActionsDashboard } from '../Components/QuickActionsPage';
import type { QuickActionItem } from '../Components/QuickActionsPage';

// Mock data
const mockActions: QuickActionItem[] = [
  {
    id: 'review-applications',
    label: 'Review Applications',
    icon: <CheckCircleOutlineIcon />,
    variant: 'contained'
  },
  {
    id: 'view-jurisdiction',
    label: 'View Jurisdiction',
    icon: <PlaceIcon />,
    variant: 'outlined'
  },
  {
    id: 'send-message',
    label: 'Send Message',
    icon: <ChatBubbleOutlineIcon />,
    variant: 'outlined'
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: <AnalyticsIcon />,
    variant: 'outlined'
  }
];

// Storybook Meta
const meta: Meta<typeof QuickActions> = {
  title: 'Commissioner Dashboard/QuickActions',
  component: QuickActions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'QuickActions component showing actionable buttons for commissioner tasks with Material-UI styling.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed at the top of the quick actions panel',
    },
    actions: {
      description: 'Array of action items with icons, labels, and styling options',
    }
  }
};

export default meta;

// Dashboard Stories
export const CompleteDashboard: StoryObj<typeof QuickActionsDashboard> = {
  render: (args) => <QuickActionsDashboard {...args} />,
  args: {
    actions: mockActions
  }
};