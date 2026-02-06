// PlotInfoCard.tsx displays plot and building setback information for a property on the Citizen property details page.
// It shows survey, address, and IGRS setback details using MUI for UI and localization for labels.
// Main responsibilities:
// - Map API property data to display fields
// - Render info grid for plot details
// - Render building setback grid
// - Show loading state and handle missing data
// Props: property (CitizenPropertyData) - the property whose plot info is shown
import { Box, Divider, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useAppSelector } from "../../../../../redux/Hooks";
import { getMessagesFromSession, useLocalization } from "../../../../../services/Citizen/Localization/LocalizationContext";
import LoadingPage from "../../../../components/Loader";
import type { CitizenPropertyData } from "../../models/CitizenPropertiesPageModel/CitizenPropertyPageModel";
import activity_zone from "../../../../assets/activity_zone.svg"

// Props for PlotInfo: expects property data
interface PlotInfoProps {
  property: CitizenPropertyData;
}

// PlotInfo component: displays plot and building setback info for a property
const PlotInfo: FC<PlotInfoProps> = ({ property }) => {
  // Localization, state, and hooks
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession("CITIZEN")!; // Localized messages

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // No property data: render nothing
  if (!property) return null;

  // Map API data to display fields
  // const surveyNumber = property.AdditionalDetails?.fieldValue?.serialNo?.toString() || '-';
  const complexName = property.ComplexName.toString() || '-';
  const locality = property.Address?.Locality || '-';
  const zoneNo = property.Address?.ZoneNo || '-';
  const wardNo = property.Address?.WardNo || '-';
  const blockNo = property.Address?.BlockNo || '-';
  const street = property.Address?.Street || '-';

  // Building Setbacks from IGRS (if available)
  const frontSetback = property.IGRS?.frontSetback ? `${property.IGRS.frontSetback} ft` : '-';
  const coverage = property.IGRS?.builtUpAreaPct ? `${property.IGRS.builtUpAreaPct}%` : '-';
  const rearSetback = property.IGRS?.rearSetback ? `${property.IGRS.rearSetback} ft` : '-';
  const sideSetback = property.IGRS?.sideSetback ? `${property.IGRS.sideSetback} ft` : '-';

  // Render plot info and building setback grids
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid #00000033",
        mb: 1.2,
      }}
    >
      {/* Heading with icon */}
      <Box display="flex" alignItems="center" mb={1}>
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: 0,
            mr: 1,
          }}
        >
          {/* svg icon for plot info */}
          <img src={activity_zone} alt="Activity Zone" height="18" width="18" />
        </Box>
        <Typography fontWeight={700} fontSize={16}>
          {messages['citizen.my-properties'][lang]['plt-info']}
        </Typography>
      </Box>
      {/* Info Grid: survey, address, etc. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 1.8,
          columnGap: 3,
        }}
      >
        {/* Survey Number / Locality */}
        <Box>
          <Typography fontSize={13} color="#888">
            Apartment Name
          </Typography>
          <Typography fontWeight={700} color="#222">
            {complexName}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13} color="#888">
            Locality
          </Typography>
          <Typography fontWeight={700} color="#222">
            {locality}
          </Typography>
        </Box>
        {/* Zone No / Ward No */}
        <Box>
          <Typography fontSize={13} color="#888">
            Zone No
          </Typography>
          <Typography fontWeight={700} color="#222">
            {zoneNo}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13} color="#888">
            Ward No
          </Typography>
          <Typography fontWeight={700} color="#222">
            {wardNo}
          </Typography>
        </Box>
        {/* Block No / Street */}
        <Box>
          <Typography fontSize={13} color="#888">
            Block No
          </Typography>
          <Typography fontWeight={700} color="#222">
            {blockNo}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13} color="#888">
            Street
          </Typography>
          <Typography fontWeight={700} color="#222">
            {street}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* Building Setbacks grid */}
      <Typography fontWeight={700} fontSize={15} mt={2} mb={1}>
        {messages['citizen.my-properties'][lang]['build-setbacks']}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 1.5,
          columnGap: 3,
        }}
      >
        {/* Front Setback / Coverage */}
        <Box>
          <Typography fontSize={13} color="#888">
            {messages['citizen.my-properties'][lang]['front-setback']}
          </Typography>
          <Typography fontWeight={700} color="#222">
            {frontSetback}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13} color="#888">
            {messages['citizen.my-properties'][lang]['coverage']}
          </Typography>
          <Typography fontWeight={700} color="#222">
            {coverage}
          </Typography>
        </Box>
        {/* Rear Setback / Side Setbacks */}
        <Box>
          <Typography fontSize={13} color="#888">
            {messages['citizen.my-properties'][lang]['rear-setback']}
          </Typography>
          <Typography fontWeight={700} color="#222">
            {rearSetback}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13} color="#888">
            {messages['citizen.my-properties'][lang]['side-setback']}
          </Typography>
          <Typography fontWeight={700} color="#222">
            {sideSetback}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PlotInfo;