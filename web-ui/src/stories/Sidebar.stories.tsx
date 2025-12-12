import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '../app/components/Sidebar/SM_Sidebar';
import { serviceManagerPrimaryItems } from '../app/components/Sidebar/sidebarConfig';
import { Box } from '@mui/material';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation sidebar component with primary and secondary navigation items.',
      },
    },
  },
  argTypes: {
    open: { 
      control: 'boolean',
      description: 'Whether the sidebar is expanded or collapsed',
      onClick : {action : 'clicked'}
    },
    selectedNav: {
      control: 'select',
      options: ['dashboard', 'applicationInbox', 'searchProperty', 'allApplications', 'mapView'],
      description: 'Currently selected navigation item'
    },
    onToggle: { action: 'toggled' },
    onSelectNav: { action: 'nav-selected' },
    onProfileClick: { action: 'profile-clicked' },
    allApplicationsToggle: { 
      control: 'boolean',
      description: 'Toggle state for all applications section'
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '100vh', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 2, bgcolor: 'grey.50' }}>
          <h3>Main Content Area</h3>
          <p>This is where the main application content would be displayed.</p>
        </Box>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Default story - sidebar expanded
export const Default: Story = {
  args: {
    open: false,
    selectedNav: 'dashboard',
    primaryItems: serviceManagerPrimaryItems,
    onToggle: () => console.log('toggle-sidebar'),
    onSelectNav: (nav: string) => console.log('select-nav:', nav),
    onProfileClick: (el: HTMLElement | null) => console.log('profile-click:', el),
    allApplicationsToggle: false,
    setAllApplicationsToggle: (toggle: boolean) => console.log('set-all-applications-toggle:', toggle),
  },
};

// Collapsed sidebar story
export const Collapsed: Story = {
  args: {
    ...Default.args,
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar in collapsed state showing only icons.',
      },
    },
  },
};


// All Applications toggle story
export const AllApplicationsToggle: Story = {
  args: {
    ...Default.args,
    selectedNav: 'allApplications',
    allApplicationsToggle: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing the All Applications toggle functionality.',
      },
    },
  },
};

