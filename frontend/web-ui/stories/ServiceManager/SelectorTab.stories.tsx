import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Container } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the actual SelectorTab component - we'll create a version that handles dependencies
type TabType = 'property' | 'documents' | 'services' | 'change';

interface SelectorTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Mock child components
// const MockCards = () => (
//   <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
//     <h4>Property Details Content</h4>
//     <p>This would show property information cards, owner details, and property specifications.</p>
//   </Box>
// );

const MockSearchPropertyDocuments = () => (
  <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
    <h4>Documents Content</h4>
    <p>This would show uploaded documents, property papers, and legal documents.</p>
  </Box>
);

const MockSearchPropertyChangeLog = () => (
  <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
    <h4>Change Log Content</h4>
    <p>This would show property modification history and audit trail.</p>
  </Box>
);

// SelectorTab component that matches the original styling
const SelectorTab: React.FC<SelectorTabProps> = ({ activeTab, onTabChange }) => {
  const tabConfig: {
    label: string;
    value: TabType;
    disabled?: boolean;
  }[] = [
    { label: 'Property Details', value: 'property' },
    { label: 'Documents', value: 'documents' },
    { label: 'Services and Utilities', value: 'services', disabled: true },
    { label: 'Change Log', value: 'change' },
  ];

  // Use the original styling from selectorTabsStyle.ts
  const tabBarWrapperStyle = {
    display: 'flex',
    padding: '2px',
    px: '4px',
    m: '18px 0 12px 0',
    alignItems: 'start',
    justifyContent: 'space-between',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
    border: '1px solid #f1f5f9',
  };

  const tabButtonStyle = (active: boolean, disabled: boolean) => ({
    minWidth: 'auto',
    textTransform: 'none',
    fontSize: 14,
    color: disabled
      ? '#bcbcbc'
      : active
        ? '#054e58'
        : '#6b7280',
    margin: '10px',
    fontWeight: active ? 700 : 500,
    bgcolor: active ? '#dff6f9' : 'transparent',
    borderRadius: '10px',
    transition: 'background-color 120ms ease, color 120ms ease, transform 120ms ease',
    '&:focus': {
      outlineOffset: 1,
    },
  });

  function handleTabClick(tab: TabType) {
    if (!tabConfig.find(t => t.value === tab)?.disabled) {
      onTabChange(tab);
    }
  }

  return (
    <Container disableGutters>
      <Box
        role="tablist"
        aria-label="Property sections"
        sx={tabBarWrapperStyle}
        className="tabs"
      >
        {tabConfig.map(tab => (
          <Button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            type="button"
            onClick={() => handleTabClick(tab.value)}
            disabled={!!tab.disabled}
            sx={tabButtonStyle(activeTab === tab.value, !!tab.disabled)}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      {/* Panel */}
      <Box>
        {/* {activeTab === 'property' && <MockCards />} */}
        {activeTab === 'documents' && <MockSearchPropertyDocuments />}
        {activeTab === 'services' && ""}
        {activeTab === 'change' && <MockSearchPropertyChangeLog />}
      </Box>
    </Container>
  );
};

// Mock Redux store for child components
const createMockStore = () => {
  const mockApi = createApi({
    reducerPath: 'mockApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: () => ({}),
  });

  return configureStore({
    reducer: {
      applicationView: (state = {
        application: null,
        loading: false,
        error: null
      }) => state,
      [mockApi.reducerPath]: mockApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mockApi.middleware),
  });
};

const meta: Meta<typeof SelectorTab> = {
  title: 'ServiceManager/SelectorTab',
  component: SelectorTab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tabbed navigation component for property details with sections for Property Details, Documents, Services & Utilities, and Change Log. Features pill-shaped tab styling and disabled state support.',
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['property', 'documents', 'services', 'change'],
      description: 'Currently active tab',
    },
    onTabChange: {
      description: 'Callback function when tab is clicked',
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
            minHeight: '500px'
          }}>
            <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
              <Story />
            </Box>
          </Box>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SelectorTab>;

// Default story - Property Details tab active
export const Default: Story = {
  args: {
    activeTab: 'property',
    onTabChange: (tab: string) => console.log('tab-changed:', tab),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state with Property Details tab active. Shows pill-shaped tab navigation with property content.',
      },
    },
  },
};
