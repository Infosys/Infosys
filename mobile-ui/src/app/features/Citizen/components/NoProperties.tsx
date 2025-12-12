// NoProperties.tsx displays a message when the user has no properties added.
// It uses MUI for UI, localization for messages, and shows a sad icon and instructions.
// Main responsibilities:
// - Render a styled card with icon and localized messages
// - Show loader if localization is loading
// No props required; static message for empty property list
// NoProperties.tsx
import { Box, Typography } from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';
import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';


// NoProperties component: renders a styled card with icon and localized empty state messages
const NoProperties: React.FC = () => {
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading: localizationLoading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession('CITIZEN')!; // Localized messages

  // Show loader if localization is loading
  if (localizationLoading) {
    return <LoadingPage />;
  }

  // Render empty state card with icon and messages
  return (
    <Box
      sx={{
        mt: 8,
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#fff',
        borderRadius: 3,
        py: 5,
        px: 3,
        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {/* Sad icon for empty state */}
      <SadIcon sx={{ fontSize: 54, color: '#c84c03', mb: 1 }} />
      {/* Main message */}
      <Typography variant="h6" sx={{ color: '#c84c03', fontWeight: 600, mb: 1 }}>
        {/* No properties found */}
        {messages['citizen.no-property'][lang]['no-properties-found']}
      </Typography>
      {/* Sub-messages */}
      <Typography variant="body2" sx={{ color: '#c84c03', opacity: 0.7 }}>
        {/* You have not added any property yet. */}
        {messages['citizen.no-property'][lang]['no-property-added']}

        {/* Add properties to manage your assets! */}
        {messages['citizen.no-property'][lang]['add-properties']}
      </Typography>
    </Box>
  );
};

// Export NoProperties for use in empty property list views
export default NoProperties;
