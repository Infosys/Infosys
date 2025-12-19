
// CommissionerProperties component displays property approval details, map, and actions for a given application
import _React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import PropertyTaxCalculator from './PropertyTaxCalculator';
import { Box, Typography, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';
import { useDispatch, useSelector } from 'react-redux';
// import { } from '../../../service-manager-app-features/application-view/api/applicationApi';
import { selectApplicationError, selectApplicationLoading, setApplicationData, setApplicationError, setApplicationLoading } from '../../../service-manager-app-features/application-view/redux/apiSlice';
import { loadingContainer } from '../../all-applications/styles/AllApplicationStyle';
// import type { Property } from '../../../service-manager-app-features/application-view/model/applicationByIdModel';
import SelectorTab, { type TabType } from '../../../service-manager-app-features/application-view/components/SelectorTab/SelectorTab';
import { useGetApplicationByApplicationIdQuery } from '../../../service-manager-app-features/application-view/api/applicationApi';


export interface CommissionerPropertyProps {
  applicationID: string;
}


export const CommissionerProperties: React.FC<CommissionerPropertyProps> = ({ applicationID }) => {
  // State for the currently active tab (property, tax, etc.)
  const [activeTab, setActiveTab] = useState<TabType>('property');
  // State for the selected action (accept, reject, reassign)
  const [action, setAction] = useState('');
  // const [, setProperty] = useState<Property | null>(null);

  // Redux dispatch and selectors for loading/error state
  const dispatch = useDispatch();
  // const application = useSelector(selectApplication);
  const isLoading = useSelector(selectApplicationLoading);
  const error = useSelector(selectApplicationError);

  // Fetch application data using RTK Query
  const { data, error: apiError, isLoading: apiLoading } = useGetApplicationByApplicationIdQuery(applicationID);
  // const [acceptApplication, { isLoading: acceptLoading }] = useAcceptApplicationMutation();

  // Update Redux state when API call changes
  useEffect(() => {
    dispatch(setApplicationLoading(apiLoading));
    if (data) dispatch(setApplicationData(data));
    if (apiError) dispatch(setApplicationError(apiError));
  }, [data, apiLoading, apiError, dispatch]);

  // Handle tab change event
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
      </Box>
    );
  }

  // Show error alert if there is an error
  if (error) {
    const errorMessage =
      'status' in error
        ? `Error: ${error.status}`
        : error.message || 'Failed to load applications';

    return (
      <Box>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  // Main UI layout for property approval
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: '#0f172a',
        // width: '100%',
        fontFamily: 'Inter,Segoe UI,Roboto,Arial,Helvetica,sans-serif',
        bgcolor: '#E5E5E5',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto',
          boxSizing: 'border-box',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'none',
        }}
      >
        {/* Topbar with title and jurisdiction dropdown */}
        <Box
          sx={{
            p: 0,
            ml: 0,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                mt: '60px',
                ml: '20px'
              }}
            >
              Property Approval
            </Typography>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 300,
                ml: '20px'
              }}
            >
              Pending Action
            </Typography>
          </Box>

          {/* Jurisdiction Dropdown - Fixed at top right */}
          <Box sx={jurisdictionDropdownStyles}>
            <JurisdictionDropdown backgroundColor="#E3F2FD"
              hoverBackgroundColor="#BBDEFB" />
          </Box>

        </Box>

        {/* Main content area: action select, map, tax calculator, and tabs */}
        <Box
          sx={{
            gridTemplateColumns: '1fr var(--right-panel-width)',
            gridTemplateRows: 'auto 1fr',
            gap: 15,
            alignItems: 'start',
          }}
          className={`content${activeTab === 'property' ? '' : ' no-track'}`}
        >
          {/* Action select dropdown */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            mr: 2
          }}>
            <Select
              value={action}
              onChange={e => setAction(e.target.value)}
              size="small"
              sx={{
                bgcolor: '#0b5a7a',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: 150,
                boxShadow: 'none',
                '& .MuiSelect-icon': { color: '#fff' },
                '& fieldset': { border: 'none' },
                '& .MuiSelect-select': {
                  padding: '0 16px',
                }
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span>Act on this Application</span>;
                }
                return selected.charAt(0).toUpperCase() + selected.slice(1);
              }}
              MenuProps={{
                PaperProps: { sx: { bgcolor: '#fff', color: '#0f172a' } }
              }}
            >
              <MenuItem value="accept">Accept</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
              <MenuItem value="reassign">Reassign</MenuItem>
            </Select>
          </Box>
          {/* Map and property tax calculator side by side */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around"
            }}>
            <MapComponent />
            <PropertyTaxCalculator
              propertyName="Gandhi Nagar Complex"
              propertyId="BLR-2024-001"
              potentialDues={10000.00}
            />
          </Box>
          {/* Tabs for property details, tax, etc. */}
          <SelectorTab activeTab={activeTab} onTabChange={handleTabChange} propertyId={data?.data?.ID ?? null} />
        </Box>
      </Box>
    </Box>
  );
}