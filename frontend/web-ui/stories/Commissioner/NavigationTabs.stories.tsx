import type { Meta, StoryObj } from '@storybook/react';
import NavigationTabs from '../Components/NavigationTabs';
import type { NavigationTabItem } from '../Components/NavigationTabs';

const mockNavigationTabs: NavigationTabItem[] = [
  {
    id: '1',
    label: 'Demand Collection',
    value: 'demand-collection'
  },
  {
    id: '2',
    label: 'Coverage',
    value: 'coverage'
  },
  {
    id: '3',
    label: 'KPI Dashboard',
    value: 'kpi-dashboard'
  },
  {
    id: '4',
    label: 'Reports',
    value: 'reports'
  }
];

const meta: Meta<typeof NavigationTabs> = {
  title: 'Commissioner Dashboard/NavigationTabs',
  component: NavigationTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Navigation Tabs component for switching between different dashboard sections with Material-UI styling.'
      }
    }
  },
  argTypes: {
    tabs: {
      description: 'Array of tab items to display',
    },
    defaultValue: {
      description: 'Default selected tab value',
    },
    onTabChange: {
      action: 'tab changed',
      description: 'Callback function called when tab is changed',
    }
  }
};

export default meta;
type Story = StoryObj<typeof NavigationTabs>;

export const DefaultTabs: Story = {
  args: {
    tabs: mockNavigationTabs,
    defaultValue: 'demand-collection'
  }
};