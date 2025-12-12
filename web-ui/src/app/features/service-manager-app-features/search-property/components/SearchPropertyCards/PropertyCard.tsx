// This file defines the PropertyCard component, which displays a summary card for a property
// including its name, ID, address, agent, images, and a map preview. It is used in property search results.

import React from "react";
import { Box, Typography } from "@mui/material";
// import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
// import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AgentButton from "../SearchPropertyButtons/AgentButton";
// import ViewLocationButton from "../SearchPropertyButtons/ViewLocationButton";
import {
  cardBoxSx,
  detailsBoxSx,
  articleIconSx,
  propertyNameSx,
  propertyIdSx,
  addressSx,
  agentButtonBoxSx,
  imagesBoxSx,
  imageItemSx,
  imageIconSx,
  mapStyleSx,
  statusTextSx,
 // dateStyleSx,
} from "../../styles/SearchPropertyCards/PropertyCardStyle";

import { mapBox } from "../../styles/SearchPropertyMap/PropertyMapPreviewStyle";
import type { Document, GISData } from "../../models/GetAllProperties";
import DocumentPreview from "./DocumentPreview";
import { isImage } from "../../utils/isImage";
import { useNavigate } from "react-router-dom";
import TextButton from "../SearchPropertyButtons/TextButton";
import { MapLibreMap } from "../SearchPropertyMap/SearchPropertyMapComponent";

// Props for the PropertyCard component
interface PropertyCardProps {
  propertyName: string; // Name of the property
  propertyId: string; // Unique property identifier
  address: string; // Property address
  ward: string; // Ward name or number
  zone: string; // Zone name or number
  agentId: string; // ID of the assigned agent
  agentName?: string; // Name of the assigned agent (optional)
  agentUsername?: string; // Username of the agent (optional)
  images?: Document[]; // Array of document/image objects (optional)
  location: GISData; // Location data for the property
  createdDate: string; // Date the property was created
  uniqueId: string; // Unique ID for navigation
  status: string; // Current status of the property
  onClick?: (propertyId: string) => void; // Optional click handler
}

// Functional component for displaying a property card with details, agent, images, and map
const PropertyCard: React.FC<PropertyCardProps> = ({
  uniqueId,
  propertyName,
  propertyId,
  address,
  ward,
  zone,
  agentName = "Unassigned",
  agentUsername = "",
  images = [],
  location,
  status,
  // createdDate,
}) => {
  // Only preview the first two documents/images if available
  const docsToPreview = images ? images.slice(0, 2) : [];
  // React Router navigation hook
  const navigate = useNavigate();

  /**
   * Determine map location with fallback priority:
   * 1. location.Coordinates[0] if available
   * 2. location.Latitude and location.Longitude if available
   * 3. Default to Bangalore coordinates
   */
  const mapLocation = React.useMemo(() => {
    // Check Coordinates array first
    if (
      location?.Coordinates && 
      Array.isArray(location.Coordinates) && 
      location.Coordinates.length > 0 && 
      location.Coordinates[0]?.Latitude != null && 
      location.Coordinates[0]?.Longitude != null
    ) {
      return {
        lat: location.Coordinates[0].Latitude,
        lng: location.Coordinates[0].Longitude,
      };
    }

    // Check direct Latitude/Longitude properties
    if (
      location?.Latitude != null && 
      location?.Longitude != null
    ) {
      return {
        lat: location.Latitude,
        lng: location.Longitude,
      };
    }

    // Default to Bangalore
    return { lat: 12.9141, lng: 77.6387 };
  }, [location]);

  return (
    <Box sx={cardBoxSx}>
      {/* Article icon for visual indication */}
      <Box>
        <ArticleOutlinedIcon sx={articleIconSx} />
      </Box>

      {/* Property details section (clickable for navigation) */}
      <Box
        onClick={()=> navigate(`/service-manager/property-details/${uniqueId}`)} 
        sx={detailsBoxSx}
      >
        <Typography sx={propertyNameSx}>
          {propertyName}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
          <Typography sx={propertyIdSx}>
            {propertyId} 
          </Typography>
          {/* Status button */}
          <TextButton text={`${status}`} sx={statusTextSx} />
        </Box>
        <Typography sx={addressSx}>
          {address} &nbsp;&middot;&nbsp; {ward} &nbsp;&middot;&nbsp; {zone}
        </Typography>
        {/* Agent button section */}
        <Box sx={agentButtonBoxSx}>
          <AgentButton agentName={agentName} agentUsername={agentUsername} />
        </Box>
      </Box>

      {/* Images and map preview section */}
      <Box sx={imagesBoxSx}>
        {/* Preview up to two document images */}
        {docsToPreview.length > 0 && docsToPreview.map((doc, idx) => (
          <Box key={doc.ID || idx} sx={imageItemSx}>
            <DocumentPreview
              fileStoreId={doc.FileStoreID ? doc.FileStoreID : ""}
              fileName={doc.DocumentName}
              isImage={isImage(doc)}
              sx={imageIconSx}
            />
          </Box>
        ))}

        {/* Map preview for the property location */}
        {/* <Box sx={mapBox}>
          <PropertyMapPreview
            location={mapLocation}
            style={mapStyleSx}
            mapkey={uniqueId}
          />
        </Box> */}
        <Box sx={mapBox}>
          <MapLibreMap
            latitude={mapLocation.lat}
            longitude={mapLocation.lng}
            style={mapStyleSx}
            width="96px"
            height="74px"
            borderRadius="8px"
            zoom={18}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyCard;