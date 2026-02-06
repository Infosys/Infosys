// SearchPropertyResultCard displays a property search result with status, address, and location map.
// Used in Agent screens to show property details and allow viewing location on a map.
import React from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Custom SVG icon for map marker (room icon)
const roomIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="#C84C0E"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
const markerIcon = L.divIcon({
  html: roomIconSvgString,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

// Props for SearchPropertyResultCard:
//   - id: property ID
//   - address: property address
//   - isVerified: property verification status
//   - highlight: optional highlight flag
//   - onViewLocation: callback for location view button
export interface SearchPropertyResultCardProps {
  id: string;
  address: string;
  isVerified: boolean;
  latlng: { lat: number; lng: number };
  onViewLocation?: () => void;
}

// Helper to get status label and colors based on verification
const getStatusProps = (isVerified: boolean) => {
  if (isVerified) {
    return {
      label: 'Verified',
      color: '#00703C',
      bg: '#F5F5F5',
    };
  }
  return {
    label: 'Pending',
    color: '#A59400',
    bg: '#FBEEE8',
  };
};

const SearchPropertyResultCard: React.FC<SearchPropertyResultCardProps> = ({
  id,
  address,
  isVerified,
  latlng,
  onViewLocation,
}) => {
  // Get status label and colors
  const status = getStatusProps(isVerified);

  return (
    <Box
      sx={{
        mb: 2.2,
        borderRadius: '16px',
        bgcolor: status.bg,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 2,
        gap: 2,
      }}
    >
      {/* Left section: status, ID, address */}
      <Box  sx={{ maxWidth: '60%' }}>
        <Chip
          label={status.label}
          sx={{
            bgcolor: status.color,
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            mb: 1.2,
            px: 1.5,
            borderRadius: '15px',
          }}
          size="small"
        />
        <Typography
          fontWeight={700}
          fontSize={16}
          color="#222"
          pb={0.3}
          sx={{ lineHeight: 1.25 }}
        >
          {id}
        </Typography>
        <Typography fontWeight={500} fontSize={13} color="#434343" mt={0.8} mb={0.4}>
          Address
        </Typography>
        <Typography
          fontWeight={700}
          fontSize={15}
          color="#222"
          mb={1}
          sx={{ lineHeight: 1.25 }}
        >
          {address}
        </Typography>
      </Box>
      {/* Map and view location button */}
      <Box
        sx={{
          width: 150,
          height: 150,
          minWidth: 102,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100px',
            borderRadius: '12px',
          }}
        >
          <MapContainer
            center={[latlng?.lat ?? 0, latlng?.lng ?? 0]}
            zoom={14}
            scrollWheelZoom={false}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              background: '#f6f6f6',
            }}
            dragging={false}
            doubleClickZoom={false}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latlng?.lat ?? 0, latlng?.lng ?? 0]} icon={markerIcon} />
          </MapContainer>
        </Box>
        {/* Button to view location in detail */}
        <Button
          variant="text"
          startIcon={<OpenInNewOutlinedIcon sx={{ color: '#000', fontSize: 12 }} />}
          sx={{
            backgroundColor: '#DBFAD3',
            color: '#000',
            fontWeight: 450,
            fontSize: 10,
            minWidth: 0,
            borderRadius: '10px',
            pb: 0.5,
          }}
          onClick={onViewLocation}
        >
          View Location
        </Button>
      </Box>
    </Box>
  );
};

// Export SearchPropertyResultCard for use in Agent screens
export default SearchPropertyResultCard;
