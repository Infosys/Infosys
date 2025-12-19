import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserStatsCard } from '../components/UserStatsCard';
import { SearchBar } from '../components/SearchBar';
import { FilterDropdown } from '../components/FilterDropdown';
import { UserTable } from '../components/UserTable';
import { JurisdictionDropdown } from '../../../components/JurisdictionDropdown/JurisdictionDropdown';
import FilterListIcon from '@mui/icons-material/FilterList';

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const mockUsers = [
    {
      user: 'Rajesh Kumar',
      officialId: 'BBMP/PTO/2024/001',
      designation: 'Property Tax Officer',
      role: 'Tax Officer',
      jurisdiction: 'Ward 24 (BBMP)',
      status: 'Active' as const,
    },
    {
      user: 'Priya Sharma',
      officialId: 'BBMP/GIS/2024/012',
      designation: 'GIS Officer',
      role: 'GIS Admin',
      jurisdiction: 'City Level (BBMP)',
      status: 'Active' as const,
    },
    {
      user: 'Anil Reddy',
      officialId: 'BBMP/FA/2024/089',
      designation: 'Field Agent',
      role: 'Verifier',
      jurisdiction: 'Ward 38 (BBMP)',
      status: 'Active' as const,
    },
    {
      user: 'Lakshmi Menon',
      officialId: 'BBMP/DEO/2024/023',
      designation: 'Data Entry Operator',
      role: 'Data Entry',
      jurisdiction: 'Zone 3 (BBMP)',
      status: 'Active' as const,
    },
    {
      user: 'Rohan Kumar',
      officialId: 'BBMP/PTO/2024/014',
      designation: 'Property Tax Officer',
      role: 'Tax Officer',
      jurisdiction: 'Ward 56(BBMP)',
      status: 'Active' as const,
    },
  ];

  return (
    <Container maxWidth={false} sx={{ py: 4, px: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1, fontFamily: 'Roboto' }}>
              User Management
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#6b7280', fontFamily: 'Roboto' }}>
              Manage system users and permissions
            </Typography>
          </Box>
          <JurisdictionDropdown 
            backgroundColor="#10729B40"
            hoverBackgroundColor="#10729B60"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
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
              }
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards Row */}
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', mb: 4, gap: 0 }}>
        <UserStatsCard
          title="Total Users"
          value="1,018"
          highlightColor="#000"
        />
        <UserStatsCard
          title="Active Users"
          value="945"
          highlightColor="#000"
        />
        <UserStatsCard
          title="Field Agents"
          value="890"
          highlightColor="#000"
        />
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SearchBar
          value={searchQuery}
          placeholder="Search by name, ID, or email"
          onChange={setSearchQuery}
        />
        <FilterDropdown
          options={['All Status', 'Active', 'Inactive']}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          options={['All Roles', 'Tax Officer', 'GIS Admin', 'Verifier', 'Data Entry']}
          value={roleFilter}
          onChange={setRoleFilter}
        />
        <Button
          startIcon={<FilterListIcon />}
          variant="outlined"
          sx={{
            color: '#23506a',
            fontSize: '14px',
            fontWeight: 500,
            border: '1.5px solid #23506a',
            borderRadius: '8px',
            padding: '8px 24px',
            textTransform: 'none',
            backgroundColor: 'transparent',
            minWidth: '150px',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'rgba(35, 80, 106, 0.04)',
              border: '1.5px solid #23506a',
            }
          }}
        >
          More Filter
        </Button>
      </Box>

      {/* User Table */}
      <Box>
        <UserTable
          rows={mockUsers.map(user => ({
            ...user,
            onEdit: () => console.log('Edit user:', user.user),
            onDelete: () => console.log('Delete user:', user.user),
          }))}
        />
      </Box>
    </Container>
  );
};
