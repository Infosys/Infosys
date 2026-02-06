import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '../src/services/Citizen/Localization/LocalizationContext';
import { store } from '../src/store';
import ChromeTabs from '../src/app/features/Citizen/components/ChromeTabs';

// Seed minimal localization messages into sessionStorage so ChromeTabs can read them
const seedMessages = () => {
  const key = 'localization_CITIZEN';
  const messages = {
    'citizen.home': {
      en: { 'map-btn': 'Map', 'list-btn': 'List' }
    }
  };
  sessionStorage.setItem(key, JSON.stringify(messages));
};

// Initialize Redux store with proper language state
const initializeStore = () => {
  // Ensure the store has the proper language state
  if (!store.getState().lang?.citizenLang) {
    store.dispatch({ type: 'lang/setCitizenLang', payload: 'en' });
  }
};

const meta: Meta<typeof ChromeTabs> = {
  title: 'Citizen/ChromeTabs(Real)',
  component: ChromeTabs,
  argTypes: {
    selected: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'Currently selected tab (0 = Map, 1 = List)',
    },
    height: {
      control: { type: 'number', min: 40, max: 80, step: 4 },
      description: 'Height of the tab buttons',
    },
    customWidth: {
      control: 'text',
      description: 'Custom width for the tab container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChromeTabs>;

export const Default: Story = {
  args: {
    selected: 0,
    height: 56,
  },
  render: (args) => {
    seedMessages();
    initializeStore();
    const [selected, setSelected] = React.useState(args.selected);
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <Box sx={{ p: 4 }}>
            <ChromeTabs
              selected={selected}
              onTabChange={setSelected}
              height={args.height}
              customWidth={args.customWidth}
            />
          </Box>
        </LocalizationProvider>
      </Provider>
    );
  },
};

export const MapSelected: Story = {
  args: {
    selected: 0,
    height: 56,
  },
  render: (args) => {
    seedMessages();
    initializeStore();
    const [selected, setSelected] = React.useState(0);
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <Box sx={{ p: 4 }}>
            <ChromeTabs
              selected={selected}
              onTabChange={setSelected}
              height={args.height}
              customWidth={args.customWidth}
            />
          </Box>
        </LocalizationProvider>
      </Provider>
    );
  },
};

export const ListSelected: Story = {
  args: {
    selected: 1,
    height: 56,
  },
  render: (args) => {
    seedMessages();
    initializeStore();
    const [selected, setSelected] = React.useState(1);
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <Box sx={{ p: 4 }}>
            <ChromeTabs
              selected={selected}
              onTabChange={setSelected}
              height={args.height}
              customWidth={args.customWidth}
            />
          </Box>
        </LocalizationProvider>
      </Provider>
    );
  },
};

export const CustomHeight: Story = {
  args: {
    selected: 0,
    height: 72,
  },
  render: (args) => {
    seedMessages();
    initializeStore();
    const [selected, setSelected] = React.useState(args.selected);
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <Box sx={{ p: 4 }}>
            <ChromeTabs
              selected={selected}
              onTabChange={setSelected}
              height={args.height}
              customWidth={args.customWidth}
            />
          </Box>
        </LocalizationProvider>
      </Provider>
    );
  },
};

export const CustomWidth: Story = {
  args: {
    selected: 0,
    height: 56,
    customWidth: '400px',
  },
  render: (args) => {
    seedMessages();
    initializeStore();
    const [selected, setSelected] = React.useState(args.selected);
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <Box sx={{ p: 4 }}>
            <ChromeTabs
              selected={selected}
              onTabChange={setSelected}
              height={args.height}
              customWidth={args.customWidth}
            />
          </Box>
        </LocalizationProvider>
      </Provider>
    );
  },
};
