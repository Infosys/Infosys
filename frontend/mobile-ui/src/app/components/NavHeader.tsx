
// NavHeader is a reusable top header component for both Citizen and Agent interfaces.
// It displays a fixed header bar with a styled 'Previous' button, localized label, and icon.
// The label and localization are determined by the role prop (CITIZEN or AGENT).
// Used for consistent navigation and UI across screens that require a back/previous action.
import { type FC } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { getAppLocale } from '../../services/Profile/ProfileService';
import { getMessagesFromSession } from '../../services/Citizen/Localization/LocalizationContext';


const NavHeader: FC<{role : string}> = ({role}) => {
  // Get current language from profile service
  const lang = getAppLocale();
  // Get localized messages for the given role (CITIZEN or AGENT)
  const messages = getMessagesFromSession(role === "CITIZEN" ? "CITIZEN" : "AGENT")!;
  // React Router navigation hook
  const navigate = useNavigate();

  return (
    // Outer Box: fixed header bar, styled background
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 80,
        zIndex: 999,
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Previous button: navigates to previous page, styled as per design */}
      <Button
        onClick={() => navigate(-1)}
        disableElevation
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff',
          border: '2px solid #eedcd2',
          boxSizing: 'border-box',
          borderRadius: '20px',
          width: "160px",
          height: '50px',
          boxShadow: 'none',
          textTransform: 'none',
          p: 0,
          '&:hover': {
            bgcolor: '#fff',
            border: '2px solid #f3e6df',
            boxShadow: 'none',
          },
        }}
      >
        {/* Chevron icon for previous/back action */}
        <ChevronLeftIcon sx={{ color: '#C84C0E', fontSize: 28, mr: 0.5 }} />
        {/* Localized label for previous/back, based on role */}
        <Typography
          color="#C84C0E"
          fontWeight={300}
          fontSize={16}
        >
          {(role === "CITIZEN" ? messages['citizen.commons'][lang]['prev-btn'] : messages['common'][lang]['previous.btn']) ?? "Previous"}
        </Typography>
      </Button>
    </Box>
  );
};

export default NavHeader;
