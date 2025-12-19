// Service Manager Dashboard main component
// Displays recent property applications and agent directory with search/filter functionality

import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, CircularProgress, Button } from '@mui/material';
import { ApplicationCard } from './ApplicationCard';
import { AgentCard } from './AgentCard';
import { cardSection, dashboardContainer, dashboardHeader, dashboardLoadingContainer, mainContentGrid, scrollableAgentsContainer, sectionTitle, subtitleText, titleText } from '../../styles/ServiceManagerDashboard/ServiceManagerDashboardStyle';
import { SearchBarWithFilter } from '../AgentSearchBar/AgentSearchBar';
import { JurisdictionDropdown } from '../../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../../styles/HomePageStyle/HomePageStyle';
import { useGetAllPropertyApplicationsQuery } from '../../api/dashboardApi';
import { useGetAllAgentsQuery } from '../../api/dashboardAgentsApi';
import { useSidebar } from '../../../../../components/Sidebar/provider/SMSideBarProvider';
import type { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';

// Props for the ServiceManagerDashboard component
interface ServiceManagerDashboardProps {
  sideBarOpen?: boolean; // (Optional) Whether the sidebar is open
  setSelectedNav?: (nav: string) => void; // (Optional) Handler to set selected navigation
}

const ServiceManagerDashboard: React.FC<ServiceManagerDashboardProps> = () => {
  // Get selected zone from Redux store
  const selectedZone = useSelector((state: RootState) => state.user.selectedZone);
  // Only fetch applications if a zone and wards are selected
  const shouldFetch = !!selectedZone && !!selectedZone.zoneNumber && selectedZone.wards.length > 0;

  // Fetch recent property applications for the selected zone/wards
  const {
    data: dashboardApplicationsData,
    isLoading: applicationsLoading,
    error: dashboardError,
  } = useGetAllPropertyApplicationsQuery({ 
    page: 0, 
    size: 5,
    zoneNo: selectedZone?.zoneNumber,
    wardNos: selectedZone?.wards
  }, { skip: !shouldFetch });

  // Sidebar navigation handler from context
  const {
    handleNavSelection,
  } = useSidebar();
  
  // Fetch all agents for the directory (for ApplicationCard props)
  const { data: agentsData } = useGetAllAgentsQuery();

  // Fetch all agents with loading and error state (for Agent Directory)
  const {
    data: dashboardAgentsData,
    isLoading: agentsLoading,
    error: agentsError,
  } = useGetAllAgentsQuery();

  // State for agent search input
  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (val: string) => setSearchValue(val);

  // All agents from API response
  const allAgents = dashboardAgentsData?.data?.users || [];

  // Filter agents based on search input
  const filteredAgents = useMemo(() => {
    if (!searchValue.trim()) return allAgents;
    const q = searchValue.toLowerCase();
    return allAgents.filter(agent =>
      [
        agent.id,
        agent.username,
        agent.profile?.firstName,
        agent.profile?.lastName,
        agent.profile?.fullName,
      ].some(field => field && field.toLowerCase().includes(q))
    );
  }, [allAgents, searchValue]);

  // Render dashboard layout
  return (
    <Container maxWidth={false} sx={dashboardContainer}>
      {/* Jurisdiction dropdown for selecting zone/ward */}
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F0DED1" />
      </Box>

      {/* Dashboard header with title and subtitle */}
      <Box sx={dashboardHeader}>
        <Box>
          <Typography variant="h4" sx={titleText}>
            Service Manager Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={subtitleText}>
            Property Verification Management System
          </Typography>
        </Box>
      </Box>

      {/* Main content grid: Applications and Agent Directory */}
      <Box sx={mainContentGrid}>
        {/* Recent Applications section */}
        <Box sx={cardSection}>
          <Typography variant="h5" sx={sectionTitle}>
            Recent Applications
          </Typography>
          {/* Show loading, error, empty, or list of applications */}
          {applicationsLoading ? (
            <Container sx={dashboardLoadingContainer}>
              <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
            </Container>
          ) : dashboardError ? (
            <Typography sx={subtitleText}>Error loading applications</Typography>
          ) : !dashboardApplicationsData?.data || dashboardApplicationsData.data.length === 0 ? (
            <Typography sx={subtitleText}>No applications found</Typography>
          ) : (
            dashboardApplicationsData.data.map(app => (
              <ApplicationCard 
                key={app.ID} 
                application={app}
                agentsData={agentsData}
              />
            ))
          )}
          {/* Button to view all applications */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              sx={{
                border: '1.5px solid #C84C0E',
                color: '#C84C0E',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'none',
                px: 4,
                py: 0.5,
                transition: 'box-shadow 0.2s',
                mr: 2,
              }}
              onClick={() => {
                handleNavSelection('allApplications');
              }}
            >
              View All
            </Button>
          </Box>
        </Box>

        {/* Agent Directory section */}
        <Box sx={cardSection}>
          <Typography variant="h5" sx={sectionTitle}>
            Agent Directory
          </Typography>
          {/* Search bar for filtering agents */}
          <SearchBarWithFilter
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            filterLabel="Filter"
          />
          <Box sx={scrollableAgentsContainer}>
            {/* Show loading, error, empty, or list of agents */}
            {agentsLoading ? (
              <Container sx={dashboardLoadingContainer}>
                <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
              </Container>
            ) : agentsError ? (
              <Typography sx={subtitleText}>Error loading agents</Typography>
            ) : filteredAgents.length === 0 ? (
              <Typography sx={subtitleText}>No agents found</Typography>
            ) : (
              filteredAgents.map(agent => agent.zoneData && agent.zoneData.length > 0 ? <AgentCard key={agent.id} agent={agent} /> : null)
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ServiceManagerDashboard;