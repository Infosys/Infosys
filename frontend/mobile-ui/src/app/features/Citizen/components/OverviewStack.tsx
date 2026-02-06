// OverviewStack.tsx displays a summary stack of property details for the Citizen property details page.
// It shows property type, construction year, built-up area, plot area, and property value using MUI and localization.
// Main responsibilities:
// - Map API property data to display fields
// - Render summary rows for key property info
// - Use icons and localization for labels
// Props: property (CitizenPropertyData) - the property whose summary is shown
import { Box, Stack, Typography } from '@mui/material';
import type { FC } from 'react';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { HouseOutlined } from '@mui/icons-material';
import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
import type { CitizenPropertyData } from '../models/CitizenPropertiesPageModel/CitizenPropertyPageModel';
import activity_zone from "../../../assets/activity_zone.svg"

// Props for OverviewStack: expects property data
interface OverviewStackProps {
  property: CitizenPropertyData;
}

// OverviewStack component: renders summary stack of property details
const OverviewStack: FC<OverviewStackProps> = ({ property }) => {
  // Localization, state, and hooks
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession('CITIZEN')!; // Localized messages

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // No property: render nothing
  if (!property) return null;

  // Map API property data to display fields for UI
  const propertyType = property.PropertyType || '-';

  // Construction year - extract from FloorDetails or use default
  const constructionYear = property.ConstructionDetails?.FloorDetails?.[0]?.constructionDate
    ? new Date(property.ConstructionDetails.FloorDetails[0].constructionDate).getFullYear()
    : '-';

  // Built-up Area - sum of all floor plinth areas
  const builtUpArea =
    property.ConstructionDetails?.FloorDetails?.reduce(
      (sum, floor) => sum + (floor.PlinthAreaSqFt || 0),
      0
    ).toFixed(2) + ' sq ft' || '-';

  // Plot Area - from IGRS or AssessmentDetails
  const plotArea =
    property.IGRS?.totalPlinthArea
      ? `${property.IGRS.totalPlinthArea} sq ft`
      : property.AssessmentDetails?.ExtendOfSite || '-';

  // Property Value - you'll need to calculate or get from another source
  // const propertyValue = '-'; 
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {/* First Row: Property Type & Construction Year */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        {/* Property Type */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <HouseOutlined sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }} />
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['property-type']}
            </Typography>
            <Typography
              fontWeight={700}
              color="#222"
              fontSize={15}
              sx={{ lineHeight: 1.2 }}
            >
              {propertyType}
            </Typography>
          </Box>
        </Stack>
        {/* Construction Year */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <InfoOutlinedIcon sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }} />
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['construct-year']}
            </Typography>
            <Typography
              fontWeight={700}
              color="#222"
              fontSize={15}
              sx={{ lineHeight: 1.2 }}
            >
              {constructionYear}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      {/* Second Row: Built-up Area & Plot Area */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        {/* Built-up Area */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <img src={activity_zone} alt="Activity Zone" height="18" width="18" />
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['built-up-area']}
            </Typography>
            <Typography
              fontWeight={700}
              color="#222"
              fontSize={16}
              sx={{ lineHeight: 1.2 }}
            >
              {builtUpArea}
            </Typography>
          </Box>
        </Stack>
        {/* Plot Area */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <CropSquareIcon sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }} />
          <Box>
            <Typography fontSize={13} color="#888">
              {messages['citizen.my-properties'][lang]['plot-area']}
            </Typography>
            <Typography
              fontWeight={700}
              color="#222"
              fontSize={16}
              sx={{ lineHeight: 1.2 }}
            >
              {plotArea}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      {/* Property Value */}
      <Box mt={0.5} paddingLeft={4}>
        <Typography fontSize={13} color="#888">
          {}
        </Typography>
        <Typography fontWeight={700} color="#222" fontSize={17}>
          {}
        </Typography>
      </Box>
    </Stack>
  );
};

// Export OverviewStack for use in property overview sections
export default OverviewStack;