import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ApplicationInboxFilterButton from '../app/features/service-manager-app-features/application-inbox/components/ApplicationInboxButtons/ApplicationInboxFilterButton';
import filterSlice from '../app/features/service-manager-app-features/application-inbox/store/filterSlice';
import { Box } from '@mui/material';

// Mock API for Storybook
const mockOnboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllAgents: builder.query({
      // Return mocked data directly via queryFn to avoid duplicate 'query' keys
      queryFn: async () => ({
        data: {
          data: {
            users: [
              { id: '1', profile: { fullName: 'John Smith' } },
              { id: '2', profile: { fullName: 'Sarah Johnson' } },
              { id: '3', profile: { fullName: 'Michael Brown' } },
              { id: '4', profile: { fullName: 'Emma Davis' } },
              { id: '5', profile: { fullName: 'Robert Wilson' } },
            ],
          },
        },
      }),
    }),
  }),
});

// Create mock store with RTK Query middleware
const createMockStore = (initialFilterState = {}) => {
  return configureStore({
    reducer: {
      filter: filterSlice,
      [mockOnboardingApi.reducerPath]: mockOnboardingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mockOnboardingApi.middleware),
    preloadedState: {
      filter: {
        agents: [],
        wards: [],
        statuses: [],
        zones:[],
        priority: '',
        sort: '',
        searchValue: '',
        ...initialFilterState,
      },
    },
  });
};

const meta: Meta<typeof ApplicationInboxFilterButton> = {
  title: 'Components/ApplicationInboxFilterButton',
  component: ApplicationInboxFilterButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Filter button component that opens a dialog with advanced filtering options for property applications. Includes agent selection, status filtering, and sorting options.',
      },
    },
  },
  decorators: [
    (Story) => {
      const store = createMockStore();
      return (
        <Provider store={store}>
          <Box sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}>
            <Story />
          </Box>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ApplicationInboxFilterButton>;

// Default story
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default filter button with filter icon. Click to open the filter dialog with various filtering options.',
      },
    },
  },
};

// With active filters
export const WithActiveFilters: Story = {
  decorators: [
    (Story) => {
      const store = createMockStore({
        agents: ['John Smith', 'Sarah Johnson'],
        statuses: ['NEW_CONSTRUCTION'],
        searchValue: 'Prestige'
      });
      return (
        <Provider store={store}>
          <Box sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}>
            <Story />
          </Box>
        </Provider>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Filter button when filters are already applied. The Redux store contains pre-selected agents and status filters.',
      },
    },
  },
};
