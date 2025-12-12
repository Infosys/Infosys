
// NavBar is a reusable top navigation bar component specifically for the Citizen interface.
// It provides quick access to navigation actions: going back to the previous page and returning to the citizen home screen.
// The component uses localization for button labels and adapts to the current language.
// Used across multiple Citizen screens for consistent navigation and user experience.
import { Box } from '@mui/material';
import type { FC } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../services/Citizen/Localization/LocalizationContext';
import NavButton from './NavButton';
import LoadingPage from './Loader';


const NavBar: FC = () => {
  const navigate = useNavigate(); // React Router navigation hook
  const lang = useAppSelector((state) => state.lang.citizenLang); // Get current citizen language
  const { loading } = useLocalization(); // Localization loading state
  const messages = getMessagesFromSession('CITIZEN')!; // Localized messages for citizen module

  // Show loader while localization messages are loading
  if (loading) {
    return <LoadingPage />;
  }

  return (
    // Outer Box: fixed at the top, styled background, horizontal layout
    <Box
      sx={{
        position: 'fixed',
        top: `86px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '100%',
        zIndex: 1099,
        bgcolor: "#EEDCD2",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pt: 3,
        pb: 1.2,
        px: 2,
        borderBottom: `1.5px solid #EEDCD2`,
      }}
    >
      {/* Previous button: navigates to previous page */}
      <NavButton
        icon={<ArrowBackIosNewIcon sx={{ color: "#D88336", fontSize: 20 }} />}
        message={messages['citizen.commons'][lang]['prev-btn']}
        onClick={() => navigate(-1)}
      />
      {/* Home button: navigates to citizen home page */}
      <NavButton
        icon={<HomeOutlinedIcon sx={{ color: "#D88336", fontSize: 20 }} />}
        message={messages['citizen.commons'][lang]['home-btn']}
        onClick={() => navigate('/citizen', { replace: true })}
      />
    </Box>
  );
};

export default NavBar;
