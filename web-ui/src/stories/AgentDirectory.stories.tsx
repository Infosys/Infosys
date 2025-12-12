import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';

import { dashboardContainer, dashboardHeader, mainContentGrid, cardSection, sectionTitle, subtitleText, titleText } from '../app/features/service-manager-app-features/service-manager-dashboard/styles/ServiceManagerDashboard/ServiceManagerDashboardStyle';
import { AgentCard } from '../app/features/service-manager-app-features/service-manager-dashboard/components/ServiceManagerDashboard/AgentCard';
import type { AgentModel } from '../app/features/service-manager-app-features/service-manager-dashboard/models/ServiceManagerDashboard/Agent_Model';

// Example populated data (adjust as needed)
const agents: AgentModel[] = [
  {
    id: 'A-1',
    username: 'agent1',
    email: 'agent1@example.com',
    role: 'field-officer',
    name: 'Agent One',
    ward: 'Ward-1',
    preferred_language: 'en',
    preferredLanguage: 'en',
    isActive: true,
    zoneData: [
      { zoneNumber: 'Z-1', wards: ['Ward-1', 'Ward-3'] },
      { zoneNumber: 'Z-2', wards: ['Ward-5'] }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    profile: {
      firstName: 'Agent',
      lastName: 'One',
      fullName: 'Agent One',
      phoneNumber: '9999999999',
      adhaarNo: 123456789012,
      gender: 'Male',
      guardian: 'N/A',
      guardianType: 'N/A',
      dateOfBirth: '1990-05-12',
      workLocation: 'Ward-1 Field Office',
      profilePicture: 'https://example.com/img/agent1.png',
      address: {
        addressLine1: '12 Survey Lane',
        addressLine2: null,
        city: 'Sample City',
        state: 'Sample State',
        pinCode: '123456'
      },
      department: 'Property Tax',
      designation: 'Field Officer',
      relationshipToProperty: 'Enumerator',
      ownershipShare: 0,
      isPrimaryOwner: false,
      isVerified: true
    }
  },
  {
    id: 'A-2',
    username: 'agent2',
    email: 'agent2@example.com',
    role: 'field-officer',
    name: 'Agent Two',
    ward: 'Ward-2',
    preferred_language: 'en',
    preferredLanguage: 'en',
    isActive: false,
    zoneData: [
      { zoneNumber: 'Z-3', wards: ['Ward-2', 'Ward-4'] }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    profile: {
      firstName: 'Agent',
      lastName: 'Two',
      fullName: 'Agent Two',
      phoneNumber: '8888888888',
      adhaarNo: 987654321098,
      gender: 'Female',
      guardian: 'N/A',
      guardianType: 'N/A',
      dateOfBirth: '1992-11-03',
      workLocation: 'Ward-2 Field Office',
      profilePicture: 'https://example.com/img/agent2.png',
      address: {
        addressLine1: '45 Mapping Street',
        addressLine2: 'Suite 7',
        city: 'Sample City',
        state: 'Sample State',
        pinCode: '654321'
      },
      department: 'Property Tax',
      designation: 'Field Officer',
      relationshipToProperty: 'Verifier',
      ownershipShare: 0,
      isPrimaryOwner: false,
      isVerified: false
    }
  }
];

const AgentDirectory: React.FC = () => {
  return (
    <Container maxWidth={false} sx={dashboardContainer}>
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>Agent Directory</Typography>
          <Typography variant="subtitle1" sx={subtitleText}>Field Agent Listing</Typography>
        </Box>
      </Box>

      <Box sx={mainContentGrid}>
        <Box sx={cardSection}>
          <Typography variant="h6" sx={sectionTitle}>Agents</Typography>
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

const meta: Meta<typeof AgentDirectory> = {
  title: 'Pages/AgentDirectory',
  component: AgentDirectory,
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
type Story = StoryObj<typeof AgentDirectory>;

export const Default: Story = {};
