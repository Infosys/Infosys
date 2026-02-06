// UnderConstruction.tsx
// This component displays a friendly "Under Construction" page for unfinished routes.
// Shows a builder animation, localized messages, and a navigation header.
import { type FC } from 'react';
import { Box, Typography } from '@mui/material';

// Local asset (replace with correct path if needed)
import builderGif from '../assets/Citizen/under_construction/tenor.gif';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../services/Citizen/Localization/LocalizationContext';
import { getUserFromSession } from '../../context/AuthProvider';
import { useAppSelector } from '../../redux/Hooks';
import LoadingPage from '../components/Loader';
import NavHeader from '../components/NavHeader';

/**
 * UnderConstructionPage component
 * Renders an under construction message with animation and localization.
 */
const UnderConstructionPage: FC = () => {
  // Get loading state, user info, and localized messages
  const { loading } = useLocalization();
  const user = getUserFromSession();
  const messages = getMessagesFromSession(
    user!.role === 'CITIZEN' ? 'CITIZEN' : 'AGENT'
  )!;
  const lang = useAppSelector((state) =>
    user!.role.toUpperCase() === 'CITIZEN' ? state.lang.citizenLang : state.lang.agentLang
  );
  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // Render the under construction page UI
  return (
    <Box>
      {/* Navigation header with user role */}
      <NavHeader role={user!.role.toUpperCase()} />
      {/* Main content container */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '100px',
        }}
      >
        {/* Animated builder GIF in a styled circle */}
        <Box
          sx={{
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(112, 95, 87, 0.07)',
            background: '#f5f5f5',
            px: { xs: 3, md: 7 },
            py: { xs: 5, md: 7 },
            border: '1px solid #00000033',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 380,
          }}
        >
          {/* Animated Circle with Builder GIF */}
          <Box
            sx={{
              mb: 2,
              animation: 'floatY 2s ease-in-out infinite',
              width: 104,
              height: 104,
              borderRadius: '50%',
              background: '#fff',
              border: '5px solid #C84C0E',
              boxShadow: '0 4px 16px #fcc8aca0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={builderGif}
              alt="Builder at work"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
              }}
            />
          </Box>
          {/* Main under construction heading */}
          <Typography
            variant="h4"
            fontWeight={700}
            color="#C84C0E"
            gutterBottom
            textAlign="center"
          >
            {messages['under-construction'][lang]['page-under-construction'] ??
              'Page Under Construction'}
          </Typography>
          {/* Subtext with additional info */}
          <Typography
            fontSize={18}
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            {messages['under-construction'][lang]['making-something-awesome'] ??
              "We're making something awesome for you!"}
            <br />
            {messages['under-construction'][lang]['check-back-soon'] ??
              'Please check back soon.'}
            .
          </Typography>
        </Box>
      </Box>
      {/* Float animation for builder GIF (inline demo) */}
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0);}
          50% { transform: translateY(-14px);}
          100% { transform: translateY(0);}
        }
      `}</style>
    </Box>
  );
};

export default UnderConstructionPage;
