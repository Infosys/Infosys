// EnumOptComponent.tsx displays either enumerated info cards or a progress bar for property enumeration status.
// It uses MUI for UI, localization for labels, and shows last updated date.
// Main responsibilities:
// - Show EnumeratedInfo cards if progress is 100%
// - Otherwise, show progress bar and last updated info
// - Use localization for labels/messages
// Props: property (CitizenPropertyData) - the property whose enumeration status is shown
import type { FC } from 'react';
import EnumeratedInfo from './EnumeratedInfo';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
import type { CitizenPropertyData } from '../models/CitizenPropertiesPageModel/CitizenPropertyPageModel';

interface ExtendedPropertyData extends CitizenPropertyData {
  enumerationProgress?: number;
  isDraft?: boolean;
  applicationStatus?: string;
}

interface EnumOptComponentProps {
  property: ExtendedPropertyData;
}

// EnumOptComponent: shows enumerated info or progress bar for property enumeration
const EnumOptComponent: FC<EnumOptComponentProps> = ({ property }) => {
  // Localization, state, and hooks
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession('CITIZEN')!; // Localized messages

  // No property: render nothing
  if (!property) return null;

  // Get enumeration progress from property
  // Default to 50 if not provided and not a draft
  let progress = 50;

  if (property.enumerationProgress !== undefined) {
    // If enumerationProgress is -1, it means draft, show 0% progress
    if (property.enumerationProgress === -1) {
      progress = 0;
    } else {
      console.log(property.enumerationProgress);

      progress = property.enumerationProgress;
    }
  }

  // Get last updated date from property
  const lastUpdated = property.UpdatedAt
    ? new Date(property.UpdatedAt).toLocaleDateString()
    : '';

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // Render enumerated info cards if progress is 100%, else show progress bar
  return progress === 100 ? (
    <EnumeratedInfo
      billsDue={0} // Replace with actual bills due from API
      billsAmount={0} // Replace with actual bills amount from API
      issuedLicenses={0} // Replace with actual licenses count from API
      onViewBills={() => {
        /* handle view bills */
      }}
      onViewLicenses={() => {
        /* handle view licenses */
      }}
    />
  ) : (
    <Paper elevation={0} sx={{ p: 1.2, mb: 1.7, borderRadius: 2, bgcolor: '#fff' }}>
      <Typography fontSize={13} sx={{ mb: 0.5, color: '#444' }}>
        {messages['citizen.my-properties'][lang]['enum-progress']}
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
      {lastUpdated && (
        <Typography fontSize={11} sx={{ color: '#888', mt: 0.5 }}>
          {messages['citizen.commons'][lang]['last-updated']}: {lastUpdated}
        </Typography>
      )}
    </Paper>
  );
};

// Export EnumOptComponent for use in Citizen property details
export default EnumOptComponent;
