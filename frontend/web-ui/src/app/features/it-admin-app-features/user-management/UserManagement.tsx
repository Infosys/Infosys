import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { UserStatsCard } from "../components/UserStatsCard";
import { SearchBar } from "../components/SearchBar";
import { FilterDropdown } from "../components/FilterDropdown";
import { UserTable } from "../components/UserTable";
import { JurisdictionDropdown } from "../../../components/JurisdictionDropdown/JurisdictionDropdown";
import FilterListIcon from "@mui/icons-material/FilterList";
import { 
  useGetAllUsersQuery,
  useGetUserCountsQuery,
  useDeleteUserMutation,
  useGetUserByEmailQuery,
  useGetUserByUsernameQuery,
  useGetUserByIdQuery
} from "./api/allUserApi";
// import { useGetUserListQuery } from "./api/allUserApi";
import type { SearchedUser } from "./models/userManagementModel";
  // Role mapping
  const getRoleDisplayName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      CITIZEN: "Citizen",
      AGENT: "Agent",
      SERVICE_MANAGER: "Service Manager",
      COMMISSIONER: "Commissioner",
      ADMIN: "IT Admin",
    };
    return roleMap[role] || role;
  };

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const OFFICIAL_ID = 'DIG6789';

  // Debounce search query (wait 800ms after user stops typing to allow complete pattern entry)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Helper to detect if input looks like an incomplete UUID
  const looksLikeIncompleteUUID = (str: string) => {
    // Has hyphens and hex chars but doesn't match full UUID pattern
    return /^[0-9a-f-]+$/i.test(str) && str.includes('-') && str.length < 36;
  };

  // Helper to detect if input looks like an incomplete email
  const looksLikeIncompleteEmail = (str: string) => {
    // Has @ but very short domain part (user might still be typing)
    const atIndex = str.indexOf('@');
    return atIndex > 0 && str.length - atIndex <= 3;
  };

  // Determine if search query is an email (accepts emails with or without TLD)
  const isEmail = (str: string) => /^[^\s@]+@[^\s@]+$/.test(str);
  // Determine if search query is a UUID
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  // Fetch user counts from the API
  const {data: userCountsData, isLoading: isLoadingCounts} = useGetUserCountsQuery();

  // Skip search if input looks incomplete
  const isIncompletePattern = looksLikeIncompleteUUID(debouncedSearchQuery) || looksLikeIncompleteEmail(debouncedSearchQuery);

  // Conditional queries based on search type
  const shouldSearchById = debouncedSearchQuery && isUUID(debouncedSearchQuery);
  const shouldSearchByEmail = debouncedSearchQuery && !isIncompletePattern && isEmail(debouncedSearchQuery);
  const shouldSearchByUsername = debouncedSearchQuery && !isIncompletePattern && !isEmail(debouncedSearchQuery) && !isUUID(debouncedSearchQuery);
  const shouldGetAllUsers = !debouncedSearchQuery || isIncompletePattern;

  // Search by user ID (UUID)
  const { data: idSearchData, isLoading: isLoadingId } = useGetUserByIdQuery(
    debouncedSearchQuery,
    { skip: !shouldSearchById }
  );

  // Search by email
  const { data: emailSearchData, isLoading: isLoadingEmail } = useGetUserByEmailQuery(
    { email: debouncedSearchQuery },
    { skip: !shouldSearchByEmail }
  );

  // Search by username
  const { data: usernameSearchData, isLoading: isLoadingUsername } = useGetUserByUsernameQuery(
    { username: debouncedSearchQuery },
    { skip: !shouldSearchByUsername }
  );

  // Fetch all users with filters (when no search query)
  const { data: allUsersData, error, isLoading: isLoadingAll } = useGetAllUsersQuery({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    status: statusFilter !== "All Status" ? statusFilter : undefined,
    role: roleFilter !== "All Roles" ? roleFilter : undefined,
  }, { skip: !shouldGetAllUsers });

  // Combine loading states
  const isLoading = isLoadingCounts || isLoadingId || isLoadingEmail || isLoadingUsername || isLoadingAll;

  // Select the appropriate data based on search type
  const data = shouldSearchById
    ? idSearchData
    : shouldSearchByEmail 
    ? emailSearchData 
    : shouldSearchByUsername 
      ? usernameSearchData 
      : allUsersData;

  const [deleteUser] = useDeleteUserMutation();
  const userCounts = userCountsData?.data;

  // Normalize data structure (ID search returns single user in data, others return array in data.users)
  const users = (() => {
    if (!data?.data) return [];
    const responseData = data.data;
    
    // getUserById returns user directly in data (not data.users)
    if (shouldSearchById && responseData && 'id' in responseData) {
      return [responseData as SearchedUser];
    }
    
    // Other endpoints return users array in data.users
    if ('users' in responseData) {
      const usersData = responseData.users;
      return Array.isArray(usersData) ? usersData : [usersData];
    }
    
    return [];
  })();

// // Apply search and status filters
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch = 
//       user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesStatus = 
//       statusFilter === 'All Status' || user.isActive === (statusFilter === 'Active');

//     return matchesSearch && matchesStatus;
//   });

  const transformUserData = (users: SearchedUser[]) => {
    return users.map((user) => ({
      user: user.profile.fullName,
      officialId: OFFICIAL_ID, // or use a specific ID field if available
      designation: user.profile.designation,
      role: getRoleDisplayName(user.role),
      jurisdiction:
        user.zoneData.length > 0 ? user.zoneData[0].zoneNumber : "N/A",
      status: user.isActive ? ("Active" as const) : ("Inactive" as const),
      onEdit: () => handleEditUser(user.id),
      onDelete: () => handleDeleteUser(user.id),
    }));
  };

  const handleEditUser = (userId: string) => {
    console.log("Edit user:", userId);
    // Add your edit logic here
  };

  const handleDeleteUser = async (userId: string) => {
  try {
     await deleteUser({ userId }).unwrap();
     console.log("User deleted successfully");
   } catch (error) {
     console.error("Failed to delete user:", error);
   }
 };
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
          value={isLoading ? '...' :  (userCounts?.totalUsers?.toLocaleString() || '0')}
          highlightColor="#000"
        />
        <UserStatsCard
          title="Active Users"
          value={isLoading ? '...' : (userCounts?.activeUsers?.toLocaleString() || '0')}
          highlightColor="#000"
        />
        <UserStatsCard
          title="Field Agents"
          value={isLoading ? '...' : (userCounts?.fieldAgents?.toLocaleString() || '0')}
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
          options={['ALL ROLES', 'AGENT', 'COMMISSIONER', 'SERVICE_MANAGER','ADMIN']}
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

       {/* Loading and Error States */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Please try again.
        </Alert>
      )}

      {/* User Table */}
      {!isLoading && !error && (
      <Box>
        <UserTable rows={transformUserData(users)} />
          {/* Pagination Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              px: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, userCounts?.totalUsers || 0)} of{" "}
              {userCounts?.totalUsers} users
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={currentPage * ITEMS_PER_PAGE >= userCounts?.totalUsers!}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
      </Box>
      )}
    </Container>
  );
};
