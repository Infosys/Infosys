import React from 'react';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { StatsCard } from '../../components/StatsCard';
import { ZoneCard } from '../../components/ZoneCard';
import { RecentActivityItem } from '../../components/RecentActivityItem';
import MapView from '../../../comissioner-app-features/property-approval/components/mapview';
import { FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { useGetActiveUsersQuery } from '../api/activeUsersApi';
import { useGetTotalPropertiesQuery } from '../api/totalPropertiesApi';

interface AdminDashboardProps {
  onNavigate: (key: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { data: activeUsersData, isLoading: isLoadingUsers, error: usersError } = useGetActiveUsersQuery();
  const { data: totalPropertiesData, isLoading: isLoadingProperties, error: propertiesError } = useGetTotalPropertiesQuery();
  
  const citizens = activeUsersData?.data?.users?.filter(u => u.role === 'CITIZEN').length || 0;
  const agents = activeUsersData?.data?.users?.filter(u => u.role === 'AGENT').length || 0;
  const serviceManagers = activeUsersData?.data?.users?.filter(u => u.role === 'SERVICE_MANAGER').length || 0;

  const totalProperties = totalPropertiesData?.total || 0;

  const mappedPro = "42,891";

  const formatNumber = (num: number) => num.toLocaleString('en-US');
  
  const isLoading = isLoadingUsers || isLoadingProperties;
  const error = usersError || propertiesError;
  
  if (isLoading) {
    return (
      <Container maxWidth={false} sx={{ py: 4, px: 3, backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ py: 4, px: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Alert severity="error">
          Failed to load user data. Please try again later.
        </Alert>
      </Container>
    );
  }
  return (
    <Container maxWidth={false} sx={{ py: 4, px: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1, fontFamily: 'Roboto' }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#6b7280', fontFamily: 'Roboto' }}>
            Admin Overview
          </Typography>
        </Box>
        <JurisdictionDropdown 
          backgroundColor="#10729B40"
          hoverBackgroundColor="#10729B60"
        />
      </Box>

      {/* Stats Cards Row */}
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', mb: 3, gap: 0 }}>
        <StatsCard
          title="Total Properties"
          value={formatNumber(totalProperties)}
          subtext="+1121 This week"
          highlightColor="#C84C0E"
          width={230}
        />
        <StatsCard
          title="Mapped Properties"
          value={mappedPro}
          subtext="+4.8% Coverage"
          highlightColor="#C84C0E"
          width={230}
        />
        <StatsCard
          title="Active Users"
          substats={[
            { value: formatNumber(citizens), label: 'Citizens Registered' },
            { value: formatNumber(agents), label: 'PT Agents' },
            { value: formatNumber(serviceManagers), label: 'Service Managers' }
          ]}
          highlightColor="#C84C0E"
          width={525}
        />
      </Box>

      {/* GIS Map Overview */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2, fontFamily: 'Roboto' }}>
          GIS Map Overview
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 400,
            maxHeight: 400,
            borderRadius: 2,
            bgcolor: "#ffffff",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <MapView />
        </Box>
      </Box>

      {/* Zones Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<FaMapMarkerAlt />}
            onClick={() => onNavigate('mapConfiguration')}
            sx={{
              color: '#C84C0E',
              fontSize: '14px',
              fontWeight: 500,
              border: '2px solid #C84C0E',
              borderRadius: '8px',
              padding: '8px 20px',
              textTransform: 'none',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(200, 76, 14, 0.04)',
                border: '2px solid #C84C0E',
              }
            }}
          >
            View Map Configurations
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2 }}>
          <ZoneCard
            zoneName="Zone A"
            count="10,450"
            onViewDetails={() => console.log('View Zone A details')}
          />
          <ZoneCard
            zoneName="Zone B"
            count="15,320"
            onViewDetails={() => console.log('View Zone B details')}
          />
          <ZoneCard
            zoneName="Zone C"
            count="16,180"
            onViewDetails={() => console.log('View Zone C details')}
          />
        </Box>
      </Box>

      {/* Recent Activity Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2, fontFamily: 'Roboto' }}>
          Recent Activity
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>
          <RecentActivityItem
            icon={<FaUserAlt color="#23506a" size={18} />}
            label="New field agent added"
            subtext="Agent ID: TA-2024-0890 assigned to Ward 24"
            hoursAgo="2 hours ago"
          />
          <RecentActivityItem
            icon={<FaMapMarkerAlt color="#23506a" size={18} />}
            label="Shape file uploaded"
            subtext="Zone 3 boundaries updated (BBMP)"
            hoursAgo="5 hours ago"
          />
        </Box>
      </Box>
    </Container>
  );
};
