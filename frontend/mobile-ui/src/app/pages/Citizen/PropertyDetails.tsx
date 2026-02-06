// PropertyDetails.tsx
// This page displays detailed information for a single citizen property, including address, status, map, progress, and tabs for overview, plot info, history, and documents.
// Features:
//   - Fetches property details via RTK Query using propertyId from route
//   - Shows address, status badge, and map location
//   - View location button navigates to map view
//   - Progress bar and tabbed content (overview, plot info, history, documents)
//   - Handles loading and error states
//   - Uses localization for all labels and messages
// Used in: Citizen workflow for property review and details

import React, { useEffect } from 'react';
import { Box, Typography, Chip, Button, Tabs, Tab, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import markerSvg from '../../../assets/CitizenAssets/property_page/location.svg';
import { CottageOutlined } from '@mui/icons-material';

import { useAppSelector } from '../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../services/Citizen/Localization/LocalizationContext';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import PropertyMapSection from '../../features/Citizen/components/PropertyMapSection';
import EnumOptComponent from '../../features/Citizen/components/EnumOptComponent';
import OverviewCard from '../../features/Citizen/components/ui/OverviewCard';
import PlotInfo from '../../features/Citizen/components/ui/PlotInfoCard';
import History from '../../features/Citizen/components/ui/HistoryCard';
import Documents from '../../features/Citizen/components/ui/DocumentsTab';
import LoadingPage from '../../components/Loader';
import type { CitizenPropertyData } from '../../features/Citizen/models/CitizenPropertiesPageModel/CitizenPropertyPageModel';
import { useLazyGetApplicationByIdQuery } from '../../../redux/apis/applicationApi';

// Replace Leaflet icon creation with a plain icon-like object (no Leaflet dependency)
const customIcon = {
  iconUrl: markerSvg,
  iconSize: [40, 40] as [number, number],
  iconAnchor: [20, 40] as [number, number],
  popupAnchor: [0, -40] as [number, number],
  className: '',
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  'Under Enumeration': { bg: '#FFCDB6', color: '#000' },
  Enumerated: { bg: '#85B9A1', color: '#000' },
  Draft: { bg: '#FFC107', color: '#000' },
  Private: { bg: '#F8E8DB', color: '#D49C7A' },
  Government: { bg: '#E8FAE6', color: '#53C56C' },
};

const STATUS_PROGRESS_MAP: Record<string, number> = {
  INITIATED: 20,
  ASSIGNED: 40,
  VERIFIED: 60,
  AUDIT_VERIFIED: 80,
  APPROVED: 100,
};

interface ExtendedPropertyData extends CitizenPropertyData {
  enumerationProgress?: number;
  isDraft?: boolean;
  applicationStatus?: string;
}

const PropertyDetails: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get state passed from PropertyCard
  const {
    applicationId: passedAppId,
    enumerationProgress: passedProgress,
    isDraft,
    applicationStatus,
  } = location.state || {};

  // Fetch property details using RTK Query
  const [getApplicationById, { data, isLoading, isError }] =
    useLazyGetApplicationByIdQuery();

  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading: localizationLoading } = useLocalization();
  const messages = getMessagesFromSession('CITIZEN')!;

  // Fetch application data when component mounts
  useEffect(() => {
    if (passedAppId) {
      console.log(passedAppId);

      getApplicationById(passedAppId.toString());
    }
  }, [passedAppId, getApplicationById]);

  // Show loader while data is being fetched
  if (isLoading || localizationLoading) {
    return <LoadingPage />;
  }

  if (isError || !data?.success) {
    return (
      <Box sx={{ padding: '3rem', textAlign: 'center' }}>
        <Typography fontSize={17} fontWeight={600}>
          Property data not found.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, bgcolor: '#C84C0E', color: '#fff' }}
          onClick={() => navigate('/citizen/properties')}
        >
          Back to Properties
        </Button>
      </Box>
    );
  }

  const property = data.data.Property;

  const address = [
    property.Address?.Street,
    property.Address?.Locality,
    property.Address?.WardNo,
    property.Address?.ZoneNo,
    property.Address?.BlockNo,
    property.Address?.PinCode,
  ]
    .filter(Boolean)
    .join(', ');

  // Calculate enumeration progress
  let enumerationProgress: number; // Default to INITIATED

  if (passedProgress) {
    // Use the progress value passed from the previous screen
    enumerationProgress = passedProgress;
  } else {
    enumerationProgress = STATUS_PROGRESS_MAP[data.data.Status?.toUpperCase()] ?? 20;
  }

  // Determine display status based on enumeration progress
  let status: string;
  if (enumerationProgress === -1) {
    status = 'Draft';
  } else if (enumerationProgress === 100) {
    status = 'Enumerated';
  } else {
    status = 'Under Enumeration';
  }

  const badge = statusStyles[status] || { bg: '#F8E8DB', color: '#D49C7A' };

  // Get coordinates from GISData
  const latLng = property.GISData
    ? { lat: property.GISData.Latitude || 0, lng: property.GISData.Longitude || 0 }
    : { lat: 0, lng: 0 };

  const extendedProperty: ExtendedPropertyData = {
    ...property,
    enumerationProgress,
    isDraft,
    applicationStatus,
  };

  return (
    <Box
      sx={{
        bgcolor: '#F5F5F5',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: 400,
        mx: 'auto',
        position: 'relative',
      }}
    >
      <Header
        header="My Properties"
        subHeader="Property Information"
        icon={<CottageOutlined sx={{ fontSize: 32 }} />}
      />
      <NavBar />
      <Box
        sx={{
          pt: `${140 + 50}px`,
          pb: `${24 + 10}px`,
          px: 2,
          background: '#F5F5F5',
          boxSizing: 'border-box',
          minHeight: '100vh',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        <Box sx={{ mb: 1, mt: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: '#C84C0E',
                letterSpacing: '0.02em',
              }}
            >
              {property.PropertyNo || 'N/A'}
            </Typography>
            <Chip
              label={status}
              sx={{
                bgcolor: badge.bg,
                color: badge.color,
                fontWeight: 400,
                fontSize: 12,
                borderRadius: 2,
                px: 0.5,
                height: 20,
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, color: '#888', mb: 0.3 }}>
              {messages['citizen.my-properties'][lang]['address']}
            </Typography>
            <Typography
              sx={{ fontWeight: 600, fontSize: 16, color: '#1A1816', lineHeight: 1.4 }}
            >
              {address}
            </Typography>
          </Box>
        </Box>

        <PropertyMapSection latLng={latLng} customIcon={customIcon} />

        <Button
          size="small"
          sx={{
            alignContent: 'center',
            bgcolor: '#c84c0e',
            color: '#ffffffff',
            borderRadius: '6px',
            fontWeight: 500,
            fontStyle: 'regular',
            fontSize: 12,
            textTransform: 'none',
            p: '4px 10px',
            minHeight: 20,
            marginBottom: 1,
            '&:hover': { bgcolor: '#a03d0b' },
          }}
          onClick={() => {
            if (passedAppId) {
              localStorage.setItem('applicationId', passedAppId);
              navigate('/citizen/application-logs/' + passedAppId);
            }
          }}
        >
          View Application Log
        </Button>

        <EnumOptComponent property={extendedProperty} />

        <Paper elevation={0} sx={{ borderRadius: '20px', mb: 1, bgcolor: '#fff', px: 1 }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="fullWidth"
            slots={{
              indicator: () => null,
            }}
            sx={{
              bgcolor: '#fff',
              borderRadius: '20px',
              alignItems: 'center',
              minHeight: 44,
              display: 'flex',
              mb: 1,
              '& .MuiTab-root': {
                fontWeight: 400,
                color: '#000',
                fontSize: 14,
                textTransform: 'none',
                borderRadius: '10px',
                minHeight: 27,
                '&.Mui-selected': {
                  width: 77,
                  color: '#000',
                  alignSelf: 'center',
                  height: 24,
                  bgcolor: '#FBEEE8',
                },
              },
            }}
          >
            <Tab label={messages['citizen.my-properties'][lang]['overview-tab']} />
            <Tab label={messages['citizen.my-properties'][lang]['plot-info']} />
            <Tab label={messages['citizen.my-properties'][lang]['history-tab']} />
            <Tab label={messages['citizen.my-properties'][lang]['documents-tab']} />
          </Tabs>
        </Paper>

        {tab === 0 && <OverviewCard property={extendedProperty} />}
        {tab === 1 && <PlotInfo property={extendedProperty} />}
        {tab === 2 && <History property={extendedProperty} />}
        {tab === 3 && <Documents property={extendedProperty} />}
      </Box>
    </Box>
  );
};

// Export PropertyDetails for use in citizen property details view
export default PropertyDetails;
