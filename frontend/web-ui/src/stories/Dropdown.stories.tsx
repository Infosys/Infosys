import type { Meta, StoryObj } from '@storybook/react';
import { JurisdictionDropdown } from '../app/components/JurisdictionDropdown/JurisdictionDropdown';
import { Box, Paper } from '@mui/material';

const meta: Meta<typeof JurisdictionDropdown> = {
  title: 'Components/JurisdictionDropdown',
  component: JurisdictionDropdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A dropdown component for selecting jurisdiction areas. Features location icon, jurisdiction label, and dropdown menu with ward selections.',
      },
    },
  },
  argTypes: {
    backgroundColor: {
      control: 'color',
      description: 'Background color of the dropdown button',
      defaultValue: '#f5f5f5',
    },
    hoverBackgroundColor: {
      control: 'color',
      description: 'Background color when hovering over dropdown items',
      defaultValue: '#e0e0e0',
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{
        p: 3,
        backgroundColor: '#f8f9fa',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Story />
        </Paper>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JurisdictionDropdown>;

// Default story
export const Default: Story = {
  args: {
    backgroundColor: '#f5f5f5',
    hoverBackgroundColor: '#e0e0e0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default jurisdiction dropdown with standard gray colors. Shows Ward Nos. 24 & 38 of BBMP as the default selection.',
      },
    },
  },
};
