
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';

import { dashboardContainer, dashboardHeader, mainContentGrid, cardSection, sectionTitle, subtitleText, titleText, dashboardLoadingContainer, dashboardErrorContainer, dashboardErrorAlert } from '../app/features/service-manager-app-features/service-manager-dashboard/styles/ServiceManagerDashboard/ServiceManagerDashboardStyle';
import { ApplicationCard } from '../app/features/service-manager-app-features/service-manager-dashboard/components/ServiceManagerDashboard/ApplicationCard';

type Props = { sideBarOpen?: boolean; setSelectedNav?: (nav: string) => void };

const MockDashboard: React.FC<Props> = ({ setSelectedNav }) => {
  const applications = [
    {
      ID: 'APP-1',
      ApplicationNo: 'APP-2025-0001',
      PropertyID: 'PROP-1',
      Priority: 'High',
      TenantID: 'T1',
      DueDate: new Date().toISOString(),
      AssignedAgent: null,
      Status: 'NEW_CONSTRUCTION',
      WorkflowInstanceID: '',
      AppliedBy: 'Ramesh Kumar',
      AssesseeID: null,
      Property: { ID: 'P-1', PropertyNo: '12', OwnershipType: 'Private', PropertyType: 'Residential', ComplexName: '12 MG Road', Address: null, AssessmentDetails: null, Amenities: [], ConstructionDetails: null, AdditionalDetails: null, GISData: null, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString(), Documents: [] },
      ApplicationLogs: [],
      IsDraft: false,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    {
      ID: 'APP-2',
      ApplicationNo: 'APP-2025-0002',
      PropertyID: 'PROP-2',
      Priority: 'Medium',
      TenantID: 'T1',
      DueDate: new Date().toISOString(),
      AssignedAgent: null,
      Status: 'NEW_PROPERTY',
      WorkflowInstanceID: '',
      AppliedBy: 'Sita Devi',
      AssesseeID: null,
      Property: { ID: 'P-2', PropertyNo: '45', OwnershipType: 'Private', PropertyType: 'Residential', ComplexName: '45 Park Avenue', Address: null, AssessmentDetails: null, Amenities: [], ConstructionDetails: null, AdditionalDetails: null, GISData: null, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString(), Documents: [] },
      ApplicationLogs: [],
      IsDraft: false,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  ];



  return (
    <Container maxWidth={false} sx={dashboardContainer}>
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>Service Manager Dashboard</Typography>
          <Typography variant="subtitle1" sx={subtitleText}>Property Verification Management System</Typography>
        </Box>
      </Box>

      <Box sx={mainContentGrid}>
        <Box sx={cardSection}>
          <Typography variant="h6" sx={sectionTitle}>Recent Applications</Typography>
          {applications.map((app) => (
            <ApplicationCard key={app.ID} application={app as any} />
          ))}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              sx={{
                border: "1.5px solid #C84C0E",
                color: "#C84C0E",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "none",
                px: 4,
                py: 0.5,
                transition: "box-shadow 0.2s",
                mr: 2,
              }}
              onClick={() => { setSelectedNav && setSelectedNav('allApplications') }}
            >
              View All
            </Button>
          </Box>
        </Box>


      </Box>
    </Container>
  );
};

const meta: Meta<typeof MockDashboard> = {
  title: 'Pages/ServiceManagerDashboard',
  component: MockDashboard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Box sx={{ p: 3, backgroundColor: '#f6f7f8', minHeight: '100vh' }}>
          <Story />
        </Box>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MockDashboard>;

export const Default: Story = { args: { sideBarOpen: true, setSelectedNav: (nav: string) => console.log('nav', nav) } };

export const LoadingState: Story = {
  render: () => (
    <Container maxWidth={false} sx={dashboardContainer}>
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>Service Manager Dashboard</Typography>
          <Typography variant="subtitle1" sx={subtitleText}>Property Verification Management System</Typography>
        </Box>
      </Box>
      <Box sx={dashboardLoadingContainer}>
        <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
      </Box>
    </Container>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Container maxWidth={false} sx={dashboardContainer}>
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>Service Manager Dashboard</Typography>
          <Typography variant="subtitle1" sx={subtitleText}>Property Verification Management System</Typography>
        </Box>
      </Box>
      <Box sx={mainContentGrid}>
        <Box sx={cardSection}>
          <Typography variant="h6" sx={sectionTitle}>Recent Applications</Typography>
          <Typography sx={{ color: 'text.secondary' }}>No applications found</Typography>
        </Box>
      </Box>
    </Container>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Container maxWidth={false} sx={dashboardContainer}>
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>Service Manager Dashboard</Typography>
          <Typography variant="subtitle1" sx={subtitleText}>Property Verification Management System</Typography>
        </Box>
      </Box>
      <Box sx={dashboardErrorContainer}>
        <Typography sx={dashboardErrorAlert}>Error loading applications</Typography>
      </Box>
      <Box sx={mainContentGrid}>
        <Box sx={cardSection}>
          <Typography variant="h6" sx={sectionTitle}>Recent Applications</Typography>
          <Typography sx={{ color: 'error.main' }}>Error loading applications</Typography>
        </Box>
      </Box>
    </Container>
  ),
};