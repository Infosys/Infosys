// OverviewCard.tsx displays a summary of property details for the Citizen property details page.
// It shows government numbers, land use, zoning, and FSI, using MUI for UI and localization for labels.
// Main responsibilities:
// - Map API property data to display fields
// - Render overview and land use/zoning cards
// - Use OverviewStack for additional summary info
// - Show loading state and handle missing data
// Props: property (CitizenPropertyData) - the property whose overview is shown
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import OverviewStack from "../OverviewStack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAppSelector } from "../../../../../redux/Hooks";
import { getMessagesFromSession, useLocalization } from "../../../../../services/Citizen/Localization/LocalizationContext";
import LoadingPage from "../../../../components/Loader";
import type { CitizenPropertyData } from "../../models/CitizenPropertiesPageModel/CitizenPropertyPageModel";

// Props for OverviewCard: expects property data
interface OverviewCardProps {
  property: CitizenPropertyData;
}

// OverviewCard component: displays property summary and land use/zoning info
const OverviewCard: FC<OverviewCardProps> = ({ property }) => {
  // Localization, state, and hooks
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession("CITIZEN")!; // Localized messages

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // No property data: render nothing
  if (!property) {
    return null;
  }

  // Map API data to display fields
  // Note: These fields might not exist in CitizenPropertyData,
  // you'll need to adjust based on actual data structure
  // const surveyNumber = property.AdditionalDetails?.fieldValue?.serialNo || 'N/A';
  const zoneNo = property.Address?.ZoneNo || 'N/A';
  const ward = property.Address?.WardNo || 'N/A';
  const currentUse = property.PropertyType || 'N/A';
  const approvedUse = property.PropertyType || 'N/A';
  const zoning = property.Address?.ZoneNo || 'N/A';

  const fsiVal = (property.IGRS.builtUpAreaPct * 100 / property.IGRS.totalPlinthArea).toPrecision(4);

  const fsi = property.IGRS?.builtUpAreaPct ? `${fsiVal}%` : 'N/A';

  // Render overview and land use/zoning cards
  return (
    <>
      {/* Overview summary card */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #00000033",
          p: 2,
          borderRadius: 3,
          bgcolor: "#fff",
          mb: 1.2,
        }}
      >
        <OverviewStack property={property} />
        <Box sx={{ borderBottom: "1.1px solid #000", mb: 1.2, mt: 1.2 }} />
        <Typography fontSize={13} color="#888" mb={0.1}>
          {messages['citizen.my-properties'][lang]['gov-numbers']}
        </Typography>
        <Typography fontSize={13} color="#222" mb={0.2}>
          {/* <b>{messages['citizen.my-properties'][lang]['survey-number']}:</b> {zoneNo} */}
          <b>Zone No:</b> {zoneNo}
        </Typography>
        <Typography fontSize={13} color="#222">
          <b>{messages['citizen.my-properties'][lang]['ward']}:</b> {ward}
        </Typography>
      </Paper>

      {/* Land Use & Zoning Card - ONLY in Overview */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "#fff",
          mb: 1.2,
          border: "1px solid #00000033",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InfoOutlinedIcon sx={{ color: "#9E9E9E", mr: 1 }} />
            <Typography fontWeight={700} color="#444" sx={{ fontSize: 16 }}>
              {messages['citizen.my-properties'][lang]['land-use-zone']}
            </Typography>
          </Box>
          {/* <Button
            size="small"
            variant="contained"
            sx={{
              bgcolor: "#F8E8DB",
              color: "#E57B34",
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: "none",
              "&:hover": { bgcolor: "#F4DCC9" },
            }}
            startIcon={<MapIcon sx={{ fontSize: 18 }} />}
          >
            {messages['citizen.commons'][lang]['view-map']}
          </Button> */}
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" mb={0.7}>
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['current-use']}
            </Typography>
            <Typography fontWeight={700} color="#222">
              {currentUse}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={13} color="#888" sx = {{textAlign:"right"}}>
              {messages['citizen.my-properties'][lang]['approved-use']}
            </Typography>
            <Typography fontWeight={700} color="#222" sx = {{textAlign:"right"}}>
              {approvedUse}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="space-between" mb={0.7}>
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['zoning']}
            </Typography>
            <Typography fontWeight={700} color="#222">
              {zoning}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={13} color="#888" sx = {{textAlign:"right"}}>
              {messages['citizen.my-properties'][lang]['fsi']}
            </Typography>
            <Typography fontWeight={700} color="#222" sx = {{textAlign:"right"}}>
              {fsi}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}

export default OverviewCard;