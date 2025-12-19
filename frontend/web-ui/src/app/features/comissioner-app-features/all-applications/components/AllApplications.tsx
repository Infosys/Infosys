// This file contains the AllApplications component, which displays and manages the list of property applications for the Commissioner dashboard.
// It includes search, filter, sort, and error/loading handling, and uses Material-UI for layout and styling.
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
  Container,
  Button,
} from '@mui/material';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import type { ApplicationModel } from '../models/PropertyApplicationModel';
import { ApplicationCard } from './ApplicationCard';
import {
  pageContainer,
  headerSection,
  titleText,
  subtitleText,
  filterRow,
  searchField,
  sortDropdown,
  applicationsContainer,
  loadingContainer,
} from '../styles/AllApplicationStyle';
import { useGetAllApplicationsQuery } from '../api/allApplicationApi';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';


// Props for AllApplications (sidebar state, navigation handler if needed)
interface AllApplicationsProps {
  sideBarOpen: boolean;
  // navigate: (path: string) => void;
}


const AllApplications: React.FC<AllApplicationsProps> = ({ }) => {
  // State for filter, search, and sort
  const [filterBy, setFilterBy] = useState('Filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('New - Old');

  // Fetch applications data using RTK Query
  const {
    data: applications,
    isLoading,
    error,
  } = useGetAllApplicationsQuery({
    page: 0,
    size: 30
  })

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Implement search logic here
  };

  // Handle filter dropdown change
  const handleFilterChange = (event: any) => {
    setFilterBy(event.target.value);
  };

  // Handle sort dropdown change (future async logic can be added)
  const handleSortChange = async (event: any) => {
    const newSort = event.target.value;
    setSortOrder(newSort);
    try {
      // setLoading(true);
      // const order = newSort === 'New - Old' ? 'desc' : 'asc';
      // const apps = await AllApplicationsService.getSortedApplications(order);
      // setApplications(apps);
    } catch (err) {
      // setError('Failed to sort applications');
    } finally {
      // setLoading(false);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
      </Box>
    );
  }

  // Show error alert if data fetch fails
  if (error) {
    const errorMessage = 'status' in error
      ? `Error: ${error.status}`
      : error.message || 'Failed to load applications';

    return (
      <Box sx={pageContainer}>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={pageContainer}>
      {/* Jurisdiction dropdown at the top */}
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#C8E0E9"
          hoverBackgroundColor="#BBDEFB" />
      </Box>
      {/* Header section */}
      <Box sx={headerSection}>
        <Typography variant="h4" sx={titleText}>
          All Applications
        </Typography>
        <Typography variant="subtitle1" sx={subtitleText}>
          Manage properties under enumeration and verification
        </Typography>
      </Box>

      {/* Filter row with filter, search, and sort */}
      <Box sx={filterRow}>
        {/* Filter Dropdown */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          borderRadius: '24px',
        }}>
          <Select
            value={filterBy}
            onChange={handleFilterChange}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              bgcolor: '#A3C7D7',
              borderRadius: '24px',
              height: '48px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            <MenuItem value="Filter" disabled>Usage Type</MenuItem>
            <MenuItem value="Application No.">Application No.</MenuItem>
            <MenuItem value="Address">Address</MenuItem>
            <MenuItem value="Ward">Ward</MenuItem>
            <MenuItem value="Zone">Zone</MenuItem>
            <MenuItem value="Due Date">Due Date</MenuItem>
          </Select>
        </Box>

        {/* Search Bar */}
        <TextField
          placeholder="Search Application"
          value={searchTerm}
          onChange={handleSearch}
          sx={searchField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Sort Dropdown */}
        <FormControl sx={sortDropdown}>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              borderRadius: '24px',
              height: '48px',
              border: '1px solid #C84C0E',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#333',
            }}
          >
            <MenuItem value="New - Old">New - Old</MenuItem>
            <MenuItem value="Old - New">Old - New</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Row with action buttons */}
      <Box sx={filterRow}>
        <Button sx={{
          borderRadius: '24px',
          border: '1px solid #C84C0E',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          fontFamily: 'Roboto, sans-serif',
          fontSize: '15px',
          fontWeight: 500,
          color: '#333',
          textTransform: 'none',
        }}>Application for Approval</Button>
        <Button sx={{
          borderRadius: '24px',
          border: '1px solid #C84C0E',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          fontFamily: 'Roboto, sans-serif',
          fontSize: '15px',
          fontWeight: 500,
          color: '#333',
          textTransform: 'none',
        }}>Registered Property</Button>
      </Box>

      {/* Applications List */}
      <Box sx={applicationsContainer}>
        {isLoading ? (
          <Typography sx={subtitleText}>Loading applications...</Typography>
        ) : error ? (
          <Typography sx={subtitleText}>Error loading applications</Typography>
        ) : !applications?.data || applications.data.length === 0 ? (
          <Typography sx={subtitleText}>No applications found</Typography>
        ) : (
          applications.data.map((app) => (
            <ApplicationCard
              key={app.ID}
              application={app}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default AllApplications;