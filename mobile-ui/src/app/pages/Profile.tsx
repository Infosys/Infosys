// Profile.tsx
// This component renders the user profile page for both agents and citizens.
// Displays profile info, notification settings, support, and logout functionality.
import { type FC } from 'react';
import { Logout } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { getAppLocale } from '../../services/Profile/ProfileService';
import { getMessagesFromSession } from '../../services/Citizen/Localization/LocalizationContext';
import NavHeader from '../components/NavHeader';
import ProfileCard from '../components/ProfileCard';
import NotificationSettings from '../components/NotificationCard';
import SupportHelp from '../components/SupportCard';
import authService from '../../services/AuthService';

/**
 * ProfilePage component
 * Renders the profile page, showing user info, notification settings, support (for citizens), and logout button.
 */
const ProfilePage: FC = () => {
  // Get logout function from auth context
  const { logout } = useAuth();

  // Determine user role (agent or citizen)
  const role = authService.isAgent() ? 'AGENT' : 'CITIZEN';

  // Boolean flag for citizen profile
  const isCitizenProfile: boolean = authService.isCitizen();

  // Get navigation state for property/license counts
  const location = useLocation();
  const noOfProperties = location.state?.noOfProperties ?? 0;
  const noActiveLicenses = location.state?.noActiveLicenses ?? 0;

  // Get current language and localized messages
  const lang = getAppLocale();
  const messages = getMessagesFromSession(isCitizenProfile ? 'CITIZEN' : 'AGENT')!;
  const navigate = useNavigate();

  // Localized label for logout button
  const logOutLabel = messages['profile'][lang]['log-out'];

  // Render the profile page UI
  return (
    <div
      style={{
        maxWidth: '95%',
        margin: 'auto',
        marginTop: '45px',
        background: '#f5f5f5',
        minHeight: '100vh',
        padding: '2rem 0',
      }}
    >
      <NavHeader role={role} />
      {/* Profile card with user info and stats */}
      <ProfileCard
        isCitizenProfile={isCitizenProfile}
        noOfProperties={noOfProperties}
        noActiveLicenses={noActiveLicenses}
      />

      {/* Notification settings card */}
      <NotificationSettings isCitizenProfile={isCitizenProfile} />

      {/* Support/help card for citizens only */}
      {isCitizenProfile && <SupportHelp />}

      {/* Logout button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          p: '4px 8px',
          m: '0 4px',
          width: 'fit-content',
          borderRadius: '6px',
        }}
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        <Typography fontSize={16} color="#222" fontWeight={300}>
          {logOutLabel}
          {/* Log Out */}
        </Typography>
        <IconButton
          sx={{
            pl: '8px',
            pr: '0px',
            color: '#1c1b1f',
            background: 'transparent',
          }}
          disableRipple
          aria-label="log out"
        >
          <Logout sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </div>
  );
};

export default ProfilePage;
