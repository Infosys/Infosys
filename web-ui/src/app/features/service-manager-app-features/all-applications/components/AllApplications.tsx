import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Typography, TextField, InputAdornment, MenuItem,
  Select, FormControl, CircularProgress, Alert, Container, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  useGetAllApplicationsByDueDateQuery,
  useGetAllApplicationsByWardQuery,
  useGetAllApplicationsByZoneQuery,
  useGetAllApplicationsQuery,
  useGetApplicationByApplicationNoQuery,
} from '../api/allApplicationApi';
import { useGetAllAgentsQuery } from '../../service-manager-dashboard/api/dashboardAgentsApi';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { FILTER_TYPES, DEFAULT_SORT_ORDER, DEBOUNCE_DELAY } from '../../../../../utils/constants';
import { ApplicationsList } from './AllApplicationsList';
import { parseISO, isValid } from 'date-fns'; // Using date-fns for reliable date parsing
import { skipToken } from '@reduxjs/toolkit/query';
import {
  applicationsContainer, filterDropdown, filterRow, headerSection,
  loadingContainer, pageContainer, searchField, sortDropdown, subtitleText, titleText,
} from '../styles/AllApplicationStyle';
import type { AllApplicationModel } from '../models/PropertyApplicationModel';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';
import { Pagination } from '@mui/material';

const AllApplications: React.FC = () => {
  type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

  const [page, setPage] = useState(1);
  const [size, ] = useState(5);

  const [filterBy, setFilterBy] = useState<FilterType>(FILTER_TYPES.APPLICATION_NO);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);
  const [displayedApplications, setDisplayedApplications] = useState<AllApplicationModel[]>([]);
  const [searchActivated, setSearchActivated] = useState(false);
  const [dateConversionError, setDateConversionError] = useState<string | null>(
    null
  );
  const [listKey, setListKey] = useState(0);
  const debounceRef = useRef<number | undefined>(undefined);

  // Debounce search input to avoid excessive queries
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setSearchActivated(!!searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Convert to ISO format when searching by due date
  const convertedDueDate = useMemo(() => {
    if (filterBy === FILTER_TYPES.DUE_DATE && searchActivated && searchQuery) {
      const parsedDate = parseISO(searchQuery);
      if (isValid(parsedDate)) {
        return parsedDate.toISOString();
      }
      setDateConversionError('Invalid date format. Please use "YYYY-MM-DD".');
      return null;
    }
    return null;
  }, [filterBy, searchActivated, searchQuery]);

  // Data fetching hooks for different filters
  const { data: applications, isLoading, error } = useGetAllApplicationsQuery({ page: page - 1, size });
const { data: applicationsByWard } = useGetAllApplicationsByWardQuery(
  filterBy === FILTER_TYPES.WARD && searchActivated && searchQuery
    ? { wardNo: searchQuery, page: page - 1, size }
    : skipToken
);
const { data: applicationsByZone } = useGetAllApplicationsByZoneQuery(
  filterBy === FILTER_TYPES.ZONE && searchActivated && searchQuery
    ? { zoneNo: searchQuery, page: page - 1, size }
    : skipToken
);
const { data: applicationsByDueDate} = useGetAllApplicationsByDueDateQuery(
  filterBy === FILTER_TYPES.DUE_DATE && searchActivated && searchQuery && convertedDueDate
    ? { dueDateTo: convertedDueDate, page: page - 1, size }
    : skipToken
);
const { data: applicationByNo} = useGetApplicationByApplicationNoQuery(
  filterBy === FILTER_TYPES.APPLICATION_NO && searchActivated && searchQuery
    ? { applicationNo: searchQuery, page: page - 1, size }
    : skipToken
);

  // Update displayed applications based on filter and search state
  useEffect(() => {
    let result: AllApplicationModel[] = [];
    if (searchActivated) {
      if (filterBy === FILTER_TYPES.APPLICATION_NO && applicationByNo?.data) {
        result = applicationByNo.data;
      } else if (filterBy === FILTER_TYPES.WARD && applicationsByWard?.data) {
        result = applicationsByWard.data;
      } else if (filterBy === FILTER_TYPES.ZONE && applicationsByZone?.data) {
        result = applicationsByZone.data;
      } else if (
        filterBy === FILTER_TYPES.DUE_DATE &&
        applicationsByDueDate?.data
      ) {
        result = applicationsByDueDate.data;
      }
    } else if (applications?.data) {
      result = applications.data;
    }
    setDisplayedApplications(result);
  }, [filterBy, searchActivated, applicationByNo, applicationsByWard, applicationsByZone, applicationsByDueDate, applications]);

  // Reset search and error state when filter type changes
  useEffect(() => {
    setSearchQuery("");
    setSearchActivated(false);
    setDateConversionError(null);
  }, [filterBy]);

  // Unmount and remount list when sortOrder changes to force re-render
  useEffect(() => {
    setListKey((prev) => prev + 1);
  }, [sortOrder]);

  // Reset page to 1 when filter/search changes
useEffect(() => {
  setPage(1);
}, [filterBy, searchQuery, searchActivated]);

  // Fetch agent data for application assignment
  const { data: agentsData } = useGetAllAgentsQuery();

  // Aggregate error state for display
  const showError = error || dateConversionError;

  // Get pagination info from the correct data source
  const pagination =
  (searchActivated && filterBy === FILTER_TYPES.APPLICATION_NO && applicationByNo?.pagination) ||
  (searchActivated && filterBy === FILTER_TYPES.WARD && applicationsByWard?.pagination) ||
  (searchActivated && filterBy === FILTER_TYPES.ZONE && applicationsByZone?.pagination) ||
  (searchActivated && filterBy === FILTER_TYPES.DUE_DATE && applicationsByDueDate?.pagination) ||
  applications?.pagination;

  return (
    <Container maxWidth={false} sx={pageContainer}>
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown
          backgroundColor="#F7E4DB"
          hoverBackgroundColor="#F0DED1"
        />
      </Box>
      <Box sx={headerSection}>
        <Typography variant="h4" sx={titleText}>
          All Applications
        </Typography>
        <Typography variant="subtitle1" sx={subtitleText}>
          Manage properties under enumeration and verification
        </Typography>
      </Box>
      <Box sx={filterRow}>
        <FormControl sx={filterDropdown}>
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterType)}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              bgcolor: "#D4E4E8",
              borderRadius: "24px",
              height: "40px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {Object.values(FILTER_TYPES).map((ft) => (
              <MenuItem key={ft} value={ft}>
                {ft}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          placeholder={`Search by ${filterBy}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={searchField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchActivated(true)}
                  edge="end"
                  sx={{ color: "#666" }}
                  disabled={!searchQuery}
                  aria-label="search applications"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={sortDropdown}>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              borderRadius: "24px",
              height: "40px",
              border: "1px solid #C84C0E",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              fontFamily: "Roboto, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
            }}
          >
            <MenuItem value="New - Old">New - Old</MenuItem>
            <MenuItem value="Old - New">Old - New</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={applicationsContainer}>
        {isLoading ? (
          <Box sx={loadingContainer}>
            <CircularProgress size={60} sx={{ color: "#C84C0E" }} />
          </Box>
        ) : showError ? (
          <Alert severity="error">{dateConversionError || 'Failed to load applications'}</Alert>
        ) : displayedApplications.length === 0 ? (
          <Typography sx={subtitleText}>No applications found</Typography>
        ) : (
          <>
            <ApplicationsList
              key={listKey}
              applications={displayedApplications}
              sortOrder={sortOrder}
              agentsData={agentsData}
            />
            {pagination && pagination.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={0}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#c84c03",
                      borderColor: "#c84c03",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#c84c03 !important",
                      color: "#fff !important",
                      borderColor: "#c84c03",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      backgroundColor: "#ffe3c2",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default AllApplications;
