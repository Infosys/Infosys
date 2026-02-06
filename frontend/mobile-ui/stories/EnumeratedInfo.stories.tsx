//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import langReducer from '../src/redux/LangSlice';
import EnumeratedInfo from '../src/app/features/Citizen/components/EnumeratedInfo';

// Create a minimal store with only the lang reducer to avoid RTK Query middleware
const store = configureStore({ reducer: { lang: langReducer } });

const seedMessages = () => {
  const key = 'localization_CITIZEN';
  if (!sessionStorage.getItem(key)) {
    const messages = {
      'citizen.my-properties': {
        en: { 'bills-due': 'Bills Due', 'total-amount': 'Total Amount' }
      }
    };
    sessionStorage.setItem(key, JSON.stringify(messages));
  }
};

const meta: Meta<typeof EnumeratedInfo> = {
  title: 'Citizen/EnumeratedInfo',
  component: EnumeratedInfo,
};

export default meta;
type Story = StoryObj<typeof EnumeratedInfo>;

export const Default: Story = {
  render: () => {
    seedMessages();
    return (
      <Provider store={store}>
        <Box sx={{ p: 4 }}>
          <EnumeratedInfo billsAmount={12500} issuedLicenses={3} billsDue={0} />
        </Box>
      </Provider>
    );
  },
};

export const ZeroAmount: Story = {
  render: () => {
    seedMessages();
    return (
      <Provider store={store}>
        <Box sx={{ p: 4 }}>
          <EnumeratedInfo billsAmount={0} issuedLicenses={0} billsDue={0} />
        </Box>
      </Provider>
    );
  },
};
