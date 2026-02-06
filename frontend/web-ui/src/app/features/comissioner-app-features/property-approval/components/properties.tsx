
// CommissionerProperties component displays property approval details, map, and actions for a given application
import MapComponent from './MapComponent';
import PropertyTaxCalculator from './PropertyTaxCalculator';
import { Box, Typography, Select, MenuItem, CircularProgress, Alert, Snackbar } from '@mui/material';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';
import { loadingContainer } from '../../commissioner-all-applications/styles/AllApplicationStyle';
import SelectorTab, { type TabType } from '../../../service-manager-app-features/application-view/components/SelectorTab/SelectorTab';
import { useGetApplicationByApplicationIdQuery, useUpdateApplicationStatusMutation } from '../api/cmPropertyApprovalApi';
import { useState } from 'react';

export interface CommissionerPropertyProps {
  applicationID: string;
}


export const CommissionerProperties: React.FC<CommissionerPropertyProps> = ({ applicationID }) => {
  // State for the currently active tab (property, tax, etc.)
  const [activeTab, setActiveTab] = useState<TabType>('property');
  // State for the selected action (accept, reject, reassign)
  const [action, setAction] = useState<'approve' | 'reject' | 'reassign' | ''>('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch application data using RTK Query
  const { data, error: apiError, isLoading: apiLoading } = useGetApplicationByApplicationIdQuery(applicationID);

  // ADD THIS LINE - Call the mutation hook here at component level
  const [updateApplicationStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  // Handle tab change event
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Handle action change
  const handleActionChange = async (selectedAction: string) => {
    setAction(selectedAction as 'approve' | 'reject' | 'reassign' | '');

    // Only proceed for approve/reject actions
    if (selectedAction === 'approve' || selectedAction === 'reject') {
      try {
        // CHANGE THIS - use the mutation function, not the hook
        const result = await updateApplicationStatus({
          applicationId: applicationID,
          action: selectedAction,
          approved: selectedAction === 'approve',
          comments: selectedAction === 'approve'
            ? 'Application approved successfully'
            : 'Application rejected'
        }).unwrap();

        // Show success message
        setSnackbar({
          open: true,
          message: result.message || `Application ${selectedAction}d successfully`,
          severity: 'success'
        });

        // Reset action after success
        setTimeout(() => setAction(''), 2000);

      } catch (error: any) {
        console.error('Failed to update application status:', error);

        // Show error message
        setSnackbar({
          open: true,
          message: error?.data?.message || `Failed to ${selectedAction} application`,
          severity: 'error'
        });

        // Reset action on error
        setAction('');
      }
    }

    // Handle reassign separately
    if (selectedAction === 'reassign') {
      console.log('Reassign functionality not yet implemented');
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show loading spinner while fetching data
  if (apiLoading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
      </Box>
    );
  }

  // Show error alert if there is an error
  if (apiError) {
    const errorMessage =
      'status' in apiError
        ? `Error: ${apiError.status}`
        : apiError.message || 'Failed to load applications';
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

        {/* Main content area: action select, map and tabs */}
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
              onChange={(e) => handleActionChange(e.target.value)}
              size="small"
              disabled={isUpdating}
              sx={{
                bgcolor: isUpdating ? '#0b5a7a80' : '#0b5a7a',
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
                if (isUpdating) {
                  return <span>Processing...</span>;
                }
                if (!selected) {
                  return <span>Act on this Application</span>;
                }
                return selected.charAt(0).toUpperCase() + selected.slice(1);
              }}
              MenuProps={{
                PaperProps: { sx: { bgcolor: '#fff', color: '#0f172a' } }
              }}
            >
              <MenuItem value="approve">Approve</MenuItem>
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
            <MapComponent
              coordinates={data?.data.Property.GISData.Latitude && data?.data.Property.GISData.Longitude ? {
                latitude: data?.data.Property.GISData.Latitude,
                longitude: data?.data.Property.GISData.Longitude
              } : null}
            />
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
      {/* Snackbar for success/error notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}