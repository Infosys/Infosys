// SearchProperty page for agents to search and filter property applications
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import SearchPropertyResultCard from '../../features/Agent/components/SearchPropertyResultCard';
import { ArrowBackIos } from '@mui/icons-material';
import { useGetPropertiesQuery } from '../../features/Agent/api/searchPropertyApi';
import type { ApplicationData } from '../../features/Agent/models/SearchPropertyData.model';

// Options for which field to search by
const SEARCH_FIELD_OPTIONS = [
  { value: 'zoneNo', label: 'Zone No' },
  { value: 'wardNo', label: 'Ward No' },
  { value: 'propertyNo', label: 'Property No' },
];

// Key for caching applications in localStorage
const LOCAL_STORAGE_KEY = 'allApplications';

// Main component for property search page
const SearchProperty: React.FC = () => {
  const navigate = useNavigate();
  // State for selected search field, search query, and local application data
  const [selectedField, setSelectedField] = useState<string>('zoneNo');
  const [searchQuery, setSearchQuery] = useState('');
  const [localApplications, setLocalApplications] = useState<ApplicationData[]>([]);
  // Get agent id from localStorage
  const assignedAgent = localStorage.getItem('user_id') || '';

  // Fetch all applications assigned to agent on mount
  const {
    data: apiData,
    isLoading: apiLoading,
    isError: apiError,
  } = useGetPropertiesQuery({ assignedAgent });

  // On successful fetch, store applications in localStorage and state
  useEffect(() => {
    if (apiData?.data) {
      setLocalApplications(apiData.data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apiData.data));
    }
  }, [apiData]);

  // On mount: if no API data, restore from localStorage cache
  useEffect(() => {
    if ((!apiData || !apiData.data) && !apiLoading) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setLocalApplications(JSON.parse(cached));
      }
    }
  }, [apiData, apiLoading]);

  // Filter applications locally based on search field and query
  const filteredApplications = useMemo(() => {
    if (!localApplications || localApplications.length === 0) return [];
    if (!searchQuery.trim()) return localApplications;

    const query = searchQuery.trim().toLowerCase();
    return localApplications.filter((application) => {
      const prop = application.Property;
      if (!prop) return false;

      if (selectedField === 'propertyNo') {
        const propNo = prop.PropertyNo ?? '';
        return propNo.toString().toLowerCase().includes(query);
      }

      const address = prop.Address;
      if (!address) return false;

      if (selectedField === 'zoneNo') {
        const zone = address.ZoneNo ?? '';
        return zone.toString().toLowerCase().includes(query);
      } else if (selectedField === 'wardNo') {
        const ward = address.WardNo ?? '';
        return ward.toString().toLowerCase().includes(query);
      }
      return false;
    });
  }, [localApplications, searchQuery, selectedField]);

  // Handle Enter key in search input (filtering is automatic)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Local filtering happens automatically, nothing needed.
    }
  };

  // Go back to previous page
  const handleBack = () => navigate(-1);
  // Navigate to property location view
  const handleViewLocation = (propertyId: string) => navigate(`agent//location/${propertyId}`);

  // Main UI rendering
  return (
    <Box
      sx={{
        width: '100vw',
        maxWidth: 412,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: '#FCFCFC',
        pb: 3,
      }}
    >
      {/* Top navigation bar with back button */}
      <Box sx={{ px: 2, pt: 2, pb: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          sx={{
            height: 40,
            borderRadius: 16,
            border: '1px solid #EEDCD2',
            background: '#fff',
            color: '#C84C0E',
            px: 2.5,
            fontSize: 16,
            fontWeight: 320,
            textTransform: 'none',
            boxShadow: 'none',
            alignItems: 'center',
          }}
          onClick={handleBack}
          startIcon={<ArrowBackIos sx={{ color: '#C84C0E', fontSize: 22 }} />}
        >
          Previous
        </Button>
      </Box>

      {/* Page heading */}
      <Typography variant="h5" fontWeight={700} sx={{ px: 2, color: '#222', mb: 1 }}>
        Search Property
      </Typography>

      {/* Dropdown to select which field to search by */}
      <Typography sx={{ color: '#222', fontSize: 16, px: 2, fontWeight: 400 }}>
        Select field
      </Typography>
      <Box
        sx={{
          px: 2,
          pt: 0.5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Select
          fullWidth
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          IconComponent={(props) => (
            <ArrowDropDownIcon {...props} sx={{ color: '#C84C0E' }} />
          )}
          input={
            <OutlinedInput
              sx={{
                borderRadius: '12px',
                fontSize: 16,
              }}
            />
          }
          sx={{
            fontSize: 16,
            color: '#222',
            p: 0,
            py: 0.7,
            height: 40,
            '& fieldset': { borderColor: '#E9AC85', borderRadius: '12px' },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E9AC85',
              borderWidth: '2px',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#fff',
                color: '#222',
                borderRadius: 2,
                fontSize: 16,
                boxShadow: '0 1px 8px rgba(0,0,0,0.13)',
              },
            },
          }}
        >
          {SEARCH_FIELD_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{
                fontSize: 16,
                color: '#222',
                px: 2,
                py: 1.5,
                bgcolor: selectedField === opt.value ? '#FAECE2' : '#fff',
                '&.Mui-selected': { bgcolor: '#FAECE2' },
              }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          sx={{
            bgcolor: '#fff',
            borderRadius: '12px',
            boxShadow: 'none',
            p: 0,
            ml: 1,
            mr: 1,
            color: '#BDBDBD',
          }}
        >
          <MicNoneOutlinedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Search input box */}
      <Box sx={{ px: 2, pt: 2, pb: 2, position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search based on ${
            SEARCH_FIELD_OPTIONS.find(
              (opt) => opt.value === selectedField
            )?.label?.toLowerCase() || ''
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            bgcolor: '#f0f0f0ff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-input': {
              fontFamily: 'Roboto, sans-serif',
              boxSizing: 'border-box !important',
              minHeight: '52px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '16px !important',
              boxSizing: 'border-box !important',
            },
          }}
          inputProps={{
            style: {
              borderRadius: '8px',
              background: '#f0f0f0ff',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 35,
            height: 35,
            mr: 1.2,
            borderRadius: '50%',
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
            cursor: 'pointer',
          }}
        >
          <IconButton sx={{ color: '#222', width: '38px', height: '38px', p: 0 }}>
            <SearchIcon sx={{ fontSize: 24, color: '#222' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Show loading spinner while fetching data */}
      {apiLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#C84C0E' }} />
        </Box>
      )}

      {/* Show error message if API fetch fails */}
      {apiError && (
        <Box sx={{ px: 2, py: 2, bgcolor: '#FBEEE8', borderRadius: 2 }}>
          <Typography color="error" textAlign="center" fontWeight={500}>
            Failed to fetch properties. Showing cached results if available.
          </Typography>
        </Box>
      )}

      {/* Render filtered search results as cards */}
      <Box sx={{ px: 2 }}>
        {!apiLoading && filteredApplications && filteredApplications.length > 0
          ? filteredApplications.map((application) => {

              return (
                <SearchPropertyResultCard
                  key={application.ID}
                  id={application.Property.PropertyNo}
                  address={
                    application.Property.Address
                      ? `${application.Property.Address.Street || 'N/A'}, ${
                          application.Property.Address.Locality || 'N/A'
                        }`
                      : 'Address not available'
                  }
                  latlng={{
                    lat: application.Property.GISData?.Latitude ?? 0,
                    lng: application.Property.GISData?.Longitude ?? 0,
                  }}
                  isVerified={application.Status === 'VERIFIED'}
                  onViewLocation={() => handleViewLocation(application.PropertyID)}
                />
              );
            })
          : !apiLoading && (
              <Typography textAlign="center" color="#666" py={4}>
                {searchQuery
                  ? 'No properties found'
                  : 'Enter search criteria to filter properties'}
              </Typography>
            )}
      </Box>
    </Box>
  );
};

export default SearchProperty;
