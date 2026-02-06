// PropertyComponent.tsx
// This component displays a card summarizing a property for the citizen user.
// Shows address details, and provides buttons to view location and details.
// Props:
//   property: MappedProperty object containing location and details
//   bgcolor: background color for the card
//   propertyDetails: additional property summary info
// Used in: Citizen property listing views

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { useNavigate } from 'react-router-dom';
import type { CitizenPropertySummary } from '../../Citizen/api/CitizenHomePageApi/CitizenHomePageModel';
import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';

export interface MappedProperty {
  id: string;
  locationData: {
    address: string;
    coordinates: { lat: number; lng: number };
    BlockNo?: string;
    Locality?: string;
    PinCode?: number | string;
    Street?: string;
    WardNo?: string;
    ZoneNo?: string;
  };
  status: string;
  propertyDetails?: CitizenPropertySummary;
}

interface PropertyCardProps {
  applicationId: string;
  property: MappedProperty;
  bgcolor: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  applicationId,
  property,
  bgcolor,
}) => {
  const navigate = useNavigate();

  // Get current language and localization loading state
  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading } = useLocalization();
  const messages = getMessagesFromSession('CITIZEN')!;

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  const STATUS_PROGRESS_MAP: Record<string, number> = {
    INITIATED: 20,
    ASSIGNIED: 40,
    VERIFIED: 60,
    AUDIT_VERIFIED: 80,
    APPROVED: 100,
  };

  const progress = STATUS_PROGRESS_MAP[property.status] ?? 20;

  const viewLocationLabel = messages['citizen.home'][lang]['view-location'];

  const handleViewLocation = () => {
    navigate('/citizen/property-location', {
      state: { property },
    });
  };

  const handleViewDetails = () => {
    navigate(`/citizen/properties/${property.id}`, {
      state: {
        applicationId: applicationId,
      },
    });
  };

  const details = property.locationData || {};
  const propFallback = property.propertyDetails?.Address;

  // Build address string from available fields
  const addressFields = [
    details.BlockNo || propFallback?.BlockNo,
    details.Locality || propFallback?.Locality,
    details.Street || propFallback?.Street,
    details.WardNo || propFallback?.WardNo,
    details.ZoneNo || propFallback?.ZoneNo,
    (details.PinCode ?? propFallback?.PinCode)?.toString(),
  ]
    .filter(Boolean)
    .join(', ');

  // Render property card UI
  return (
    <Card
      sx={{
        display: 'flex',
        mb: 2,
        bgcolor,
        border: '1px solid #000000ff',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ width: '18%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 3,
          }}
        >
          <CottageOutlinedIcon
            style={{ margin: '10px', color: '#000', fontSize: '28px' }}
          />
        </Box>
      </CardContent>
      <CardContent>
        {/* Property address header with icon */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* <HomeIcon sx={{ color: 'orange', fontSize: 32 }} /> */}
          <Typography fontWeight={700} sx={{ fontSize: 16 }}>
            {addressFields || 'Address not available'}
          </Typography>
        </Box>
        <Typography fontWeight={300} sx={{ fontSize: 12 }}>
          Enumertation Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            value={progress}
            variant="determinate"
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 4,
              background: '#F3E0D1',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progress === 0 ? '#FFC107' : '#9E5F00',
              },
            }}
          />
          <Typography sx={{ color: '#000', fontSize: 13 }}>{progress}%</Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mt={2}
          gap={1}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: '#DBFAD3',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              borderRadius: 2,
              fontSize: 12,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#c5e8bd',
              },
            }}
            startIcon={<LaunchOutlinedIcon sx={{ fontSize: 12 }} />}
            onClick={handleViewLocation}
          >
            {viewLocationLabel}
          </Button>
          <Button
            sx={{
              bgcolor: '#C84C0E',
              borderRadius: 2,
              fontSize: 12,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#a03a07',
              },
            }}
            variant="contained"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Export PropertyCard for use in citizen property views
export default PropertyCard;
