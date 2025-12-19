import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { JurisdictionDropdown } from '../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { SystemRolesList } from './components/SystemRolesList';
import { PendingRequestDetail, type PendingRequest } from './components/PendingRequestDetail';
import { type RoleCardProps } from '../components/RoleCard';
import CreateNewRoleDialog from './components/Dialog/CreateNewRoleDialog';

export const AccessControl: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>('Super Admin');
  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false); 

  // Mock data for roles
  const roles: RoleCardProps[] = [
    {
      role: 'Super Admin',
      description: 'Full system access',
      userCount: 5,
      userLabel: 'users',
      levelTag: 'city level',
      requestCount: 1,
      requestLabel: 'Request',
    },
    {
      role: 'Field Agent',
      description: 'Property verification',
      userCount: 890,
      userLabel: 'users',
      levelTag: 'ward level',
      requestCount: 7,
      requestLabel: 'Requests',
    },
    {
      role: 'Service Manager',
      description: 'Property tax management',
      userCount: 15,
      userLabel: 'users',
      levelTag: 'city level',
      requestCount: 1,
      requestLabel: 'Request',
    },
    {
      role: 'GIS Admin',
      description: 'Map data management',
      userCount: 5,
      userLabel: 'users',
      levelTag: 'city level',
      requestCount: 4,
      requestLabel: 'Requests',
    },
  ];

  // Mock pending requests data
  const pendingRequests: Record<string, PendingRequest> = {
    'Super Admin': {
      id: '1',
      name: 'Rajesh Kumar',
      designation: 'Senior Tax Officer',
      email: 'rajesh.kumar@municipal.gov',
      reason:
        'Need full system access to manage critical tax operations and supervise ward-level activities.',
      level: 'city level',
      requestLabel: '1 pending request',
    },
    'Field Agent': {
      id: '2',
      name: 'Priya Sharma',
      designation: 'Property Verifier',
      email: 'priya.sharma@municipal.gov',
      reason: 'Required to verify property details and update records in Ward 24.',
      level: 'ward level',
      requestLabel: '7 pending requests',
    },
    'Service Manager': {
      id: '3',
      name: 'Anil Reddy',
      designation: 'Tax Manager',
      email: 'anil.reddy@municipal.gov',
      reason: 'Need access to manage property tax operations across the city.',
      level: 'city level',
      requestLabel: '1 pending request',
    },
    'GIS Admin': {
      id: '4',
      name: 'Lakshmi Menon',
      designation: 'GIS Specialist',
      email: 'lakshmi.menon@municipal.gov',
      reason: 'Required to update and maintain map data for property boundaries.',
      level: 'city level',
      requestLabel: '4 pending requests',
    },
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleAddNewRole = () => {
    setOpenCreateRoleDialog(true);
  };

  const handleEditRole = (role: string) => {
    console.log('Edit role:', role);
    // TODO: Implement edit role modal
  };

  const handleApprove = (requestId: string) => {
    console.log('Approve request:', requestId);
    // TODO: Implement approve logic
  };

  const handleReject = (requestId: string) => {
    console.log('Reject request:', requestId);
    // TODO: Implement reject logic
  };

  const handleDelete = (requestId: string) => {
    console.log('Delete request:', requestId);
    // TODO: Implement delete logic
  };

  const handleCloseCreateRoleDialog = () => {
    setOpenCreateRoleDialog(false); // <-- close dialog
  };

  const currentRequest = selectedRole ? pendingRequests[selectedRole] : null;

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: 3,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                mb: 1,
                fontFamily: 'Roboto',
              }}
            >
              Access Control Management
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#6b7280',
                fontFamily: 'Roboto',
              }}
            >
              Manage roles, permissions, and jurisdiction access
            </Typography>
          </Box>
          <Box>
            <JurisdictionDropdown
              backgroundColor="#10729B40"
              hoverBackgroundColor="#10729B60"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddNewRole}
                sx={{
                  backgroundColor: '#C84C0E',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(200, 76, 14, 0.2)',
                  '&:hover': {
                    backgroundColor: '#b34309',
                    boxShadow: '0 4px 8px rgba(200, 76, 14, 0.3)',
                  },
                }}
              >
                Add New Role
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column - System Roles */}
        <SystemRolesList
          roles={roles}
          selectedRole={selectedRole}
          onRoleSelect={handleRoleSelect}
          onEditRole={handleEditRole}
        />

        {/* Right Column - Pending Request Details */}
        <PendingRequestDetail
          request={currentRequest}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      </Box>

       {openCreateRoleDialog && (
        <CreateNewRoleDialog onClose={handleCloseCreateRoleDialog} />
      )}

    </Container>
  );
};
