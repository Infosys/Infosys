// BottomBar is a shared navigation component for the Citizen interface.
// It provides a fixed bottom navigation bar with quick access to Home, Utilities, Properties, and My City.
// The component uses localization and dynamic icons to reflect the current route and language.
// Used in both mobile and desktop views for consistent navigation.

import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import HomeIconFilled from '@mui/icons-material/Home';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import OfflineBoltOutlinedIcon from '@mui/icons-material/OfflineBoltOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import CottageIcon from '@mui/icons-material/Cottage';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useAppSelector } from '../../redux/Hooks';
import { getMessagesFromSession, useLocalization } from '../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from './Loader';


export function BottomBar() {
  // Get the current language for citizen from Redux store
  const lang = useAppSelector((state) => state.lang.citizenLang);
  // Get localization loading state
  const { loading } = useLocalization();
  // Get localized messages for the citizen module
  const messages = getMessagesFromSession("CITIZEN")!;

  // Show loader while localization messages are loading
  if (loading) {
    return <LoadingPage />;
  }

  // Navigation configuration for the bottom bar (desired order)
  const navConfig = [
    {
      label: messages['citizen.commons'][lang]['home-btn'],
      icon: <HomeIcon />,
      iconFilled: <HomeIconFilled />,
      path: '/citizen',
    },
    {
      label: messages['citizen.commons'][lang]['my-city-btn'],
      icon: <ApartmentOutlinedIcon />,
      iconFilled: <ApartmentIcon />,
      path: '/under-construction',
    },
    {
      label: messages['citizen.commons'][lang]['properties-btn'],
      icon: <CottageOutlinedIcon />,
      iconFilled: <CottageIcon />,
      path: '/citizen/properties',
    },
    {
      label: messages['citizen.commons'][lang]['utility-btn'],
      icon: <OfflineBoltOutlinedIcon />,
      iconFilled: <OfflineBoltIcon />,
      path: '/under-construction',
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  // Find the current nav index by matching the most specific path first
  const matchIndex = [...navConfig]
    .map((cfg, idx) => ({ idx, len: cfg.path.length, match: location.pathname.startsWith(cfg.path) }))
    .filter(x => x.match)
    .sort((a, b) => b.len - a.len)[0]?.idx ?? 0;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#F7E4DB',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.07)',
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        sx={{ bgcolor: '#F7E4DB' }}
        showLabels
        value={matchIndex}
        onChange={(_, newValue) => navigate(navConfig[newValue].path)}
      >
        {navConfig.map((cfg, idx) => (
          <BottomNavigationAction
            sx={{
              color: matchIndex === idx ? 'black' : undefined,
              '&.Mui-selected': {
                color: 'black',
              },
            }}
            key={cfg.label}
            label={cfg.label}
            icon={matchIndex === idx ? cfg.iconFilled : cfg.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}