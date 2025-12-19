import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ApplicationInboxSearchHeader from '../app/features/service-manager-app-features/application-inbox/components/ApplicationInboxHeader/ApplicationInboxSearchHeader';
import filterReducer from '../app/features/service-manager-app-features/application-inbox/store/filterSlice';
import { Box } from '@mui/material';

// Mock RTK Query API that mimics the onboardingApiSlice
const mockOnboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/mock/',
    // Mock the prepareHeaders to avoid auth errors
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Agent', 'Property'],
  endpoints: (builder) => ({
    getAllAgents: builder.query({
      query: () => '/api/v1/users?role=AGENT',
      // Mock response data
      transformResponse: () => ({
        data: {
          users: [
            { id: '1', profile: { fullName: 'John Doe Agent' } },
            { id: '2', profile: { fullName: 'Jane Smith Agent' } },
            { id: '3', profile: { fullName: 'Mike Johnson Agent' } },
          ]
        }
      }),
    }),
  }),
});

// Mock Redux store for Storybook with proper RTK Query setup
const createMockStore = (initialFilterState = {}) => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      [mockOnboardingApi.reducerPath]: mockOnboardingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mockOnboardingApi.middleware),
    preloadedState: {
      filter: {
        agents: [],
        wards: [],
        statuses: [],
        sort: '',
        priority: '',
        zones: [],
        searchValue: '',
        ...initialFilterState,
      },
    },
  });
};

const meta: Meta<typeof ApplicationInboxSearchHeader> = {
  title: 'Components/ApplicationInboxSearchHeader',
  component: ApplicationInboxSearchHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Application inbox search header with search bar and filter button. Used for searching and filtering properties in the application inbox.',
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
            <Box sx={{ width: '100%', maxWidth: '800px' }}>
              <Story />
            </Box>
          </Box>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ApplicationInboxSearchHeader>;

// Default story
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default application inbox search header with search bar and filter button.',
      },
    },
  },
};
