// This file contains the ApplicationCard component, which displays a property application card with details, tags, and a map preview.
// Used in the Commissioner dashboard's All Applications list.
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { AllApplicationModel } from '../models/PropertyApplicationModel';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  cardContainer,
  cardLeftSection,
  cardRightSection,
  propertyHeader,
  propertyIcon,
  propertyTitle,
  propertyId,
  infoIcon,
  addressText,
  tagsContainer,
  tagChip,
  actionsContainer,
  imagesSection,
  mapBox,
  viewApplicationButton,
} from '../styles/ApplicationCardStyle';
import RoomIcon from '@mui/icons-material/Room';
import { useNavigate } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import '../styles/Marker.css'

// Custom Leaflet marker icon for the map preview
const markerIcon = L.divIcon({
  html: renderToString(
    <div className="marker-wrapper">
      <RoomIcon style={{ color: '#000000ff', fontSize: 20 }} />
    </div>
  ),
  className: 'custom-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 20],
  popupAnchor: [0, -32],
});

// Props for ApplicationCard:
// - application: the application data to display
// - onSetPriority: optional callback for setting priority
interface ApplicationCardProps {
  application: AllApplicationModel;
  onSetPriority?: (id: string) => void;
}


export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application
}) => {
  // Build the full address string for display
  const getFullAddress = (): string => {
    if (application.Property.Address) {
      const addr = application.Property.Address;
      return `${addr.Street || ''}, ${addr.Locality || ''}, ${addr.WardNo || ''}`.replace(/^,\s*|,\s*$/g, '');
    }
    return application.Property.ComplexName || 'Address not available';
  };

  // Default map location (Delhi coordinates)
  const getDefaultLocation = () => ({ lat: 28.6139, lng: 77.2090 });

  // Navigation handler for clicking the card
  const navigate = useNavigate();
  const handlePropertyCardClick = (applicationID: string) => {
    // Optional: Store selected property ID in context, state, or as a route param!
    navigate(`/commissioner/property-details/${applicationID}`);
  };

  return (
    <Box sx={cardContainer}>
      {/* Left Section: property details and tags */}
      <Box sx={cardLeftSection} onClick={() => handlePropertyCardClick(application.ID)}>
        {/* Property Header: icon, name, info, and tags */}
        <Box sx={propertyHeader}>
          <DescriptionOutlinedIcon sx={propertyIcon} />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={propertyTitle}>
                {application.Property.ComplexName || 'N/A'}
              </Typography>
              {/* Info icon (can be used for tooltips or details) */}
              <InfoOutlinedIcon sx={infoIcon} />
            </Box>
            <Typography sx={propertyId}>
              {application.ApplicationNo}
            </Typography>
            <Typography sx={addressText}>
              {getFullAddress()}
            </Typography>
            {/* Tags Row: property type, ownership, priority */}
            <Box sx={tagsContainer}>
              <Chip
                icon={<MapsHomeWorkOutlinedIcon sx={{ fontSize: 13, color: '#222' }} />}
                label={application.Property.PropertyType}
                sx={tagChip}
              />
              <Chip
                icon={<DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#222' }} />}
                label={application.Property.OwnershipType}
                sx={tagChip}
              />
              <Chip
                label={`Priority: ${application.Priority}`}
                sx={tagChip}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Section: actions and map preview */}
      <Box sx={cardRightSection}>
        {/* Action Buttons */}
        <Box sx={actionsContainer}>
          <Button
            variant="contained"
            sx={viewApplicationButton}
            // onClick={() => onAssignAgent(application.ID)}
          >
            View Application
          </Button>
        </Box>

        {/* Images Section: map preview (static) */}
        <Box sx={imagesSection}>
          <Box sx={mapBox}>
            <MapContainer
              center={[getDefaultLocation().lat, getDefaultLocation().lng]}
              zoom={15}
              style={{ width: '96px', height: '74px', borderRadius: '8px' }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              attributionControl={false}
              touchZoom={false}
              boxZoom={false}
              keyboard={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[getDefaultLocation().lat, getDefaultLocation().lng]} icon={markerIcon} />
            </MapContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};