//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import langReducer from '../src/redux/LangSlice';
import { LocalizationProvider } from '../src/services/Citizen/Localization/LocalizationContext';
import { MemoryRouter } from 'react-router-dom';
import PropertyList from '../src/app/features/Citizen/components/PropertyList';
import type { CitizenApplicationSummary } from '../src/app/features/Citizen/api/CitizenHomePageApi/CitizenHomePageModel';

// Minimal store with only lang reducer
const store = configureStore({ reducer: { lang: langReducer } });

const seedMessages = () => {
  const key = 'localization_CITIZEN';
  if (!sessionStorage.getItem(key)) {
    const messages = {
      'citizen.home': {
        en: {
          'view-location': 'View Location',
          'map-btn': 'Map',
          'list-btn': 'List'
        }
      },
      'citizen.my-properties': {
        en: { 'bills-due': 'Bills Due', 'total-amount': 'Total Amount' }
      },
      'citizen.commons': {
        en: { 'view-location': 'View Location' }
      }
    };
    sessionStorage.setItem(key, JSON.stringify(messages));
  }
};

// Sample application summaries matching expected shape
const sampleApplications = [
  {
    ID: 'app-1',
    ApplicationNo: 'APP-001',
    PropertyID: 'prop-1',
    Priority: 1,
    TenantID: 'tenant-1',
    ApplicationType: 'NEW',
    Status: 'APPROVED',
    CreatedDate: new Date().toISOString(),
    ModifiedDate: new Date().toISOString(),
    WorkflowState: 'COMPLETED',
    Remarks: '',
    DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    AssignedAgent: null,
    WorkflowInstanceID: 'wf-instance-1',
    AppliedBy: 'user-1',
    TotalAmount: 5000,
    BillsDue: 1,
    LastPaymentDate: null,
    NextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    PropertyType: 'RESIDENTIAL',
    Property: {
      ID: 'prop-1',
      GISData: { Coordinates: [{ Latitude: 12.9352, Longitude: 77.6245 }] },
      Address: {
        BlockNo: 'Block A',
        Locality: 'HSR Layout',
        Street: '27th Main Road',
        WardNo: 'Ward 1',
        ZoneNo: 'Zone 3',
        PinCode: '560102'
      }
    }
  },
  {
    ID: 'app-2',
    ApplicationNo: 'APP-002',
    PropertyID: 'prop-2',
    Priority: 2,
    TenantID: 'tenant-1',
    ApplicationType: 'NEW',
    Status: 'APPROVED',
    CreatedDate: new Date().toISOString(),
    ModifiedDate: new Date().toISOString(),
    WorkflowState: 'COMPLETED',
    Remarks: '',
    DueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    AssignedAgent: null,
    WorkflowInstanceID: 'wf-instance-2',
    AppliedBy: 'user-2',
    TotalAmount: 7500,
    BillsDue: 2,
    LastPaymentDate: null,
    NextDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    PropertyType: 'COMMERCIAL',
    Property: {
      ID: 'prop-2',
      GISData: { Coordinates: [{ Latitude: 12.9716, Longitude: 77.5946 }] },
      Address: {
        BlockNo: 'Block B',
        Locality: 'Indiranagar',
        Street: '12th Main',
        WardNo: 'Ward 2',
        ZoneNo: 'Zone 5',
        PinCode: '560038'
      }
    }
  }
];

// Cast sample data to the API model type for Storybook usage
const sampleApplicationsTyped = sampleApplications as unknown as CitizenApplicationSummary[];

const meta: Meta<typeof PropertyList> = {
  title: 'Citizen/PropertyList',
  component: PropertyList,
};

export default meta;
type Story = StoryObj<typeof PropertyList>;

export const Default: Story = {
  render: () => {
    seedMessages();
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <MemoryRouter>
            <Box sx={{ p: 4 }}>
              <PropertyList properties={sampleApplicationsTyped} />
            </Box>
          </MemoryRouter>
        </LocalizationProvider>
      </Provider>
    );
  }
};

export const Empty: Story = {
  render: () => {
    seedMessages();
    return (
      <Provider store={store}>
        <LocalizationProvider role="CITIZEN">
          <MemoryRouter>
            <Box sx={{ p: 4 }}>
              <PropertyList properties={[] as CitizenApplicationSummary[]} />
            </Box>
          </MemoryRouter>
        </LocalizationProvider>
      </Provider>
    );
  }
};
