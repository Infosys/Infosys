// PropertyCard displays a summary card for a property, including address, status, and a map preview.
// It supports navigation to property details or form completion, and adapts UI based on property status.

import { type FC } from 'react';
import { Paper, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import markerSvg from '../../../assets/Citizen/property_page/location.svg';
import { Edit } from '@mui/icons-material';
import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
import MapComponent from './MapComponent';
import { useFormMode } from '../../../../context/FormModeContext';

// Plain icon-like object (compatible with MapComponent using MapLibre)
const customIcon = {
  iconUrl: markerSvg,
  iconSize: [40, 40] as [number, number],
  iconAnchor: [20, 40] as [number, number],
  popupAnchor: [0, -40] as [number, number],
  className: '',
};

// Props for PropertyCard
interface PropertyCardProps {
  property: any; // Property data object
  propertyId?: string; // Optional property ID override
}

// Color mapping for property status badges
const statusColors: Record<string, { bg: string; color: string }> = {
  Enumerated: { bg: '#85B9A1', color: '#000' },
  'Under Enumeration': { bg: '#FFCDB6', color: '#000' },
  Draft: { bg: '#FFC107', color: '#000' },
};

// Color mapping for property types
const typeColors: Record<string, string> = {
  Apartment: '#C84C0E',
  'Residential Property': '#C84C0E',
  'RESIDENTIAL Property': '#C84C0E',
  'Primary Property': '#D49C7A',
  'Industrial Property': '#53C56C',
  'INDUSTRIAL Property': '#53C56C',
  'Commercial Property': '#53C56C',
  'COMMERCIAL Property': '#53C56C',
  'MIXED Property': '#8B4513',
  'Mixed Property': '#8B4513',
};

const PropertyCard: FC<PropertyCardProps> = ({ property, propertyId }) => {
  const navigate = useNavigate();
  const { setMode } = useFormMode();

  // Compute property type label (e.g., "Residential Property")
  const type = property.propertyType + ' Property';

  // Determine property status based on enumeration progress
  // -1: Draft, 100: Enumerated, otherwise: Under Enumeration
  let status = 'Under Enumeration';
  if (property.enumerationProgress === -1) {
    status = 'Draft';
  } else if (property.enumerationProgress === 100) {
    status = 'Enumerated';
  }

  // Get color for property type and status badge
  const typeColor = typeColors[type] || '#C84C0E';
  const badge = statusColors[status] || statusColors['Under Enumeration'];

  // Get current language and localization messages
  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading } = useLocalization();
  const messages = getMessagesFromSession('CITIZEN')!;

  // Compose address string from propertyAddress or fallback to locationData
  const address = property.propertyAddress
    ? [
        property.propertyAddress.street,
        property.propertyAddress.locality,
        property.propertyAddress.wardNo,
        property.propertyAddress.zoneNo,
        property.propertyAddress.blockNo,
        property.propertyAddress.pincode,
      ]
        .filter(Boolean)
        .join(', ')
    : property.locationData?.address || '';

  // Extract latitude and longitude for map display
  const latLng = property.GISData
    ? { lat: property.GISData.Latitude || 0, lng: property.GISData.Longitude || 0 }
    : { lat: 0, lng: 0 };

  // Prevent click event from bubbling to Paper when clicking on button or map
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // Handle card click: navigate to property details or complete form if draft
  const handleCardClick = () => {
    if (status === 'Draft') {
      handleCompleteForm();
    } else {
      // Navigate to property details page with full property data
      navigate(`/citizen/properties/${property.id}`, {
        state: {
          applicationId: property.__appId,
          property: property,
          enumerationProgress: property.enumerationProgress,
          isDraft: property.isDraft,
          applicationStatus: property.applicationStatus,
        },
      });
    }
  };

  // Handle view location button click: navigate to map view
  // const handleViewLocation = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   navigate('/citizen/property-location', {
  //     state: { property },
  //   });
  // };

  // Handle complete form button click (for drafts): set mode and navigate
  const handleCompleteForm = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // Resolve property and application ids (prefer passed props, then fallback)
    const resolvedPropertyId = propertyId;
    const resolvedApplicationId = property.__appId;

    if (resolvedPropertyId) {
      localStorage.setItem('propertyId', resolvedPropertyId);
    }
    if (resolvedApplicationId) {
      localStorage.setItem('applicationId', resolvedApplicationId);
    }
    // Set form mode to draft
    setMode('draft');
    // Navigate to property form
    navigate('/property-form/preliminary-information');
  };

  // Show loader while localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // Render the property card UI
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 2.5,
        mb: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 6px #0002',
        width: '380px',
        cursor: status === 'Draft' ? 'default' : 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: status === 'Draft' ? '0 1px 6px #0002' : '0 4px 16px #0003',
        },
      }}
      onClick={status === 'Draft' ? undefined: handleCardClick}
    >
      {/* Header: Property type and status badge */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1,
        }}
      >
        <Typography
          sx={{
            color: typeColor,
            fontWeight: 300,
            fontSize: 16,
            letterSpacing: '0.01em',
          }}
        >
          {type}
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
            ml: 1,
            boxShadow: 'none',
          }}
        />
      </Box>
      {/* Address label */}
      <Typography sx={{ fontSize: 14, color: '#888', mb: 0.5 }}>
        {messages['citizen.my-properties'][lang]['address']}
      </Typography>
      {/* Address value */}
      <Typography
        sx={{
          fontWeight: 600,
          color: '#1A1816',
          fontSize: 16,
          fontStyle: 'semibold',
          mb: 0.5,
          lineHeight: 1.5,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {address || 'Address not available'}
      </Typography>
      {/* Action buttons: Complete Form (Draft) or View Location */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 1,
          gap: 1,
        }}
      >
        {status === 'Draft' && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            sx={{
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              color: '#fff',
              bgcolor: '#C84C0E',
              textTransform: 'none',
              px: 1.5,
              py: 0.5,
              minHeight: '28px',
              '&:hover': { bgcolor: '#a03a07' },
            }}
            onClick={handleCompleteForm}
          >
            Complete Form
          </Button>
        ) //</Box>: (
          // <Button
          //   variant="outlined"
          //   startIcon={<OpenInNew />}
          //   sx={{
          //     borderRadius: 8,
          //     fontWeight: 400,
          //     fontSize: 13,
          //     color: '#1A1816',
          //     borderColor: '#D5D5D5',
          //     textTransform: 'none',
          //     px: 1.2,
          //     py: 0.1,
          //     minHeight: '24px',
          //     background: '#f5f5f5',
          //     '&:hover': { background: '#F5F5F5', borderColor: '#E0C9B2' },
          //   }}
          //   onClick={handleViewLocation}
          // >
          //   {messages['citizen.commons'][lang]['view-location']}
          // </Button>
        //)
        }
      </Box>
      {/* Map preview for property location */}
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          height: 180,
          border: '1.5px solid #F3E0D1',
          mb: 0,
        }}
        onClick={stopPropagation}
      >
        <MapComponent
          latLng={{ lat: latLng.lat, lng: latLng.lng }}
          tileUrl="https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc"
          customIcon={customIcon}
        />
      </Box>
    </Paper>
  );
};

export default PropertyCard;
