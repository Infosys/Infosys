// CitizenHomePage: Main landing page for citizens, showing property list, map, language/profile controls, and urgent attention
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SearchIcon from '@mui/icons-material/Search';

import translateIndicSvg from '../../../assets/CitizenAssets/home_page/translate_indic.svg';
import { useNavigate } from 'react-router-dom';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useFormMode } from '../../../context/FormModeContext';
import { useAppDispatch, useAppSelector } from '../../../redux/Hooks';
import { setCitizenLang } from '../../../redux/LangSlice';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../services/Citizen/Localization/LocalizationContext';
import ChangeLocalePopup from '../../../components/Popup/ChangeLocalePopup';
import type { AlertType } from '../../models/AlertType.model';
import LoadingPage from '../../components/Loader';
import { BottomBar } from '../../components/BottomBar';
// --- REMOVE imported useGetCitizenHomeQuery and CitizenHomeData ---
// import type { CitizenHomeData } from '../../features/Citizen/models/CitizenHome.model';
// import { useGetCitizenHomeQuery } from '../../features/Citizen/api/Citizen.api';
import InfoCard from '../../features/Citizen/components/InfoCard';
import UrgentCard from '../../features/Citizen/components/UrgentCard';
import ChromeTabs from '../../features/Citizen/components/ChromeTabs';
import MapView from '../../features/Citizen/components/MapView';
import PropertyList from '../../features/Citizen/components/PropertyList';
import { useGetCitizenApplicationsQuery } from '../../features/Citizen/api/CitizenHomePageApi/CitizenHomePageApi';
import type { CitizenApplicationSummary } from '../../features/Citizen/api/CitizenHomePageApi/CitizenHomePageModel';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
const NEW_USER_BANGALORE_CENTER: [number, number] = [12.9603, 77.6385];
const LOCALE_MISMATCH_POPUP_FLAG = 'citizenLocaleMismatchChecked';

// Main component for citizen home page
const CitizenHomePage: React.FC = () => {
  // Use RTK Query to get citizen applications (main state)
  const SEARCH_INPUT_PROPS = {
    disableUnderline: true,
    endAdornment: <SearchIcon sx={{ color: '#888', fontSize: 23 }} />,
  };

  // Get assesseeId from localStorage
  const assesseeId = localStorage.getItem('user_id')!;

  // Fetch citizen applications (non-draft)
  const { data, isLoading, isError } = useGetCitizenApplicationsQuery({
    assesseeId,
    isDraft: false,
  });
  // List of citizen applications
  const applications: CitizenApplicationSummary[] = data?.data ?? [];
  // Number of properties for the user
  const noOfProperties = applications.length;

  // Placeholder for active licenses and urgent attention (to be replaced with backend data)
  const fakeActiveLicenses = 0;
  const fakeUrgentAttention: any[] = [];

  // State for selected tab and map marker
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedMarkerIdx, setSelectedMarkerIdx] = useState<number | null>(null);

  // Dispatcher for the Localization store
  const dispatch = useAppDispatch();

  // State for showing locale mismatch popup
  const [showChangeLocalePopup, setShowChangeLocalePopup] = useState(false);
  // Login locale from localStorage
  const loginLocale = localStorage.getItem('loginLocale') || 'en';

  // Current language from Redux store
  const lang = useAppSelector((state) => state.lang.citizenLang);

  // Loading state for localization messages
  const { loading } = useLocalization();

  // Fetch localized messages from session storage
  const messages = getMessagesFromSession('CITIZEN');

  // State for search input
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { resetForm } = usePropertyForm();
  const { setMode } = useFormMode();

  // Language dropdown state and handlers
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);
  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangMenuAnchor(event.currentTarget);
  };
  const handleLangClose = () => setLangMenuAnchor(null);
  const handleLangSelect = (code: 'en' | 'hi' | 'kn') => {
    dispatch(setCitizenLang(code));
    setLangMenuAnchor(null);
  };

  // Handlers for locale popup actions
  const handleSwitchToLoginLocale = () => {
    dispatch(setCitizenLang(loginLocale));
    setShowChangeLocalePopup(false);
    localStorage.setItem(LOCALE_MISMATCH_POPUP_FLAG, 'true');
  };
  const handleClosePopup = () => {
    setShowChangeLocalePopup(false);
    localStorage.setItem(LOCALE_MISMATCH_POPUP_FLAG, 'true');
  };

  // Initialize language from storage on mount
  useEffect(() => {
    const localeOnLogin = localStorage.getItem('citizenLocale') || 'en';
    dispatch(setCitizenLang(localeOnLogin));
  }, [dispatch]);

  // Handler for adding a new property
  const handleAddNewProperty = () => {
    resetForm();
    setMode('new');
    navigate('/property-form/preliminary-information');
  };

  // Locale mismatch popup logic, should trigger only once per user/session
  useEffect(() => {
    const alreadyChecked = localStorage.getItem(LOCALE_MISMATCH_POPUP_FLAG);
    if (alreadyChecked !== 'true') {
      if (lang && loginLocale && lang !== loginLocale) {
        setShowChangeLocalePopup(true);
      }
    }
  }, [lang, loginLocale]);

  // Popup state & effect -- show "Success" popup for 3 seconds on mount
  const [popup, setPopup] = useState<{
    type: AlertType;
    title: string;
    message: string;
    open: boolean;
  }>({ type: 'success', title: '', message: '', open: false });

  // Show welcome popup on first login
  useEffect(() => {
    // Only show once when the page loads
    const popupFlag = sessionStorage.getItem('showWelcomePopup');
    if (popupFlag === 'true') {
      setPopup({
        type: 'success',
        title: 'Successfully Logged In!',
        message: 'Welcome to Property Tax - Citizen Portal!',
        open: true,
      });
      sessionStorage.removeItem('showWelcomePopup');
    }
  }, []);

  // Show success popup after property creation
  useEffect(() => {
    const showSuccess = localStorage.getItem('showSuccessPropCreation');
    if (showSuccess === 'true') {
      setPopup({
        type: 'success',
        title: 'Success!',
        message: `Property ${localStorage.getItem('propertyNo')} created successfully!`,
        open: true,
      });
      localStorage.removeItem('propertyNo');
      localStorage.removeItem('showSuccessPropCreation');
    }
  }, []);

  // Show loader until messages AND home data are ready
  if (loading || !messages || isLoading) {
    return <LoadingPage message="Brewing up your content..." />;
  }

  // Handle error state from RTK Query
  if (isError) {
    // you can show a toast or an error UI. For now keep console and continue with empty data fallback
    console.error('Failed to load citizen home data');
  }

  const activeLicensesLabel = messages['citizen.home'][lang]['active-licences'];
  const noOfPropertiesLabel = messages['citizen.home'][lang]['number-prop'];
  const languageLabel = messages['citizen.commons'][lang]['home-language'];
  const profileLabel = messages['citizen.commons'][lang]['home-profile'];
  const notificationLabel = messages['citizen.commons'][lang]['notification-label'];
  const myPropertiesLabel = messages['citizen.commons'][lang]['my-properties'];
  const urgentAttentionLabel = messages['citizen.home'][lang]['urgent-attention'];
  const addNewPropertyLabel = messages['citizen.home'][lang]['add-new-property'];

  // Use application list as property list source
  // Main render: popups, header, language/profile controls, map, property list, and urgent attention
  return (
    <>
      <ChangeLocalePopup
        open={showChangeLocalePopup}
        currentLang={lang}
        loginLocale={loginLocale}
        onAccept={handleSwitchToLoginLocale}
        onClose={handleClosePopup}
      />
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />

      <Container
        maxWidth="xs"
        disableGutters
        sx={{ backgroundColor: '#fff', minHeight: '100vh', pb: 8 }}
      >
        <Box pt={2}>
          {noOfProperties > 0 ? (
            /* Existing user content */
            <Box>
              <Box display="flex" justifyContent="flex-end" gap={0.2} mb={2}>
                {/* Language Section with Dropdown */}
                <Box textAlign="center">
                  <IconButton
                    onClick={handleLangClick}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={translateIndicSvg}
                      alt="Language"
                      sx={{
                        width: 35,
                        height: 35,
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {languageLabel}
                    </Typography>
                  </IconButton>
                  <Menu
                    anchorEl={langMenuAnchor}
                    open={Boolean(langMenuAnchor)}
                    onClose={handleLangClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <MenuItem
                      selected={lang === 'en'}
                      onClick={() => handleLangSelect('en')}
                    >
                      English
                    </MenuItem>
                    <MenuItem
                      selected={lang === 'hi'}
                      onClick={() => handleLangSelect('hi')}
                    >
                      हिन्दी
                    </MenuItem>
                    <MenuItem
                      selected={lang === 'kn'}
                      onClick={() => handleLangSelect('kn')}
                    >
                      ಕನ್ನಡ
                    </MenuItem>
                  </Menu>
                </Box>
                {/* Notification Section */}
                <Box textAlign="center">
                  <IconButton
                    onClick={() => {}}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                      boxShadow: 'none',
                      background: 'none',
                      minWidth: 0,
                      '&:hover': { background: 'none' },
                    }}
                  >
                    <Paper
                      sx={{
                        bgcolor: '#C84C0E',
                        borderRadius: '50%',
                        width: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'none',
                      }}
                      elevation={0}
                    >
                      <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 22 }} />
                    </Paper>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {notificationLabel}
                    </Typography>
                  </IconButton>
                </Box>
                {/* Profile Section */}
                <Box textAlign="center" sx={{ paddingRight: 2 }}>
                  <IconButton
                    onClick={() =>
                      navigate('/profile', {
                        state: { noOfProperties, fakeActiveLicenses },
                      })
                    }
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                      boxShadow: 'none',
                      background: 'none',
                      minWidth: 0,
                      '&:hover': { background: 'none' },
                    }}
                  >
                    <Paper
                      sx={{
                        bgcolor: '#ffff',
                        borderRadius: '50%',
                        width: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'none',
                      }}
                      elevation={0}
                    >
                      <AccountCircleOutlinedIcon sx={{ color: '#000', fontSize: 40 }} />
                    </Paper>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {profileLabel}
                    </Typography>
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={700} pl={3}>
                {myPropertiesLabel}
              </Typography>
              <Box px={3} py={2} display="flex" gap={2}>
                <InfoCard title={activeLicensesLabel} count={fakeActiveLicenses} />
                <InfoCard title={noOfPropertiesLabel} count={noOfProperties} />
              </Box>

              {/* Urgent Attention Section (dummy, implement logic if required) */}
              {Array.isArray(fakeUrgentAttention) &&
                fakeUrgentAttention.length >= 1 &&
                fakeUrgentAttention.length <= 3 && (
                  <Box px={3} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <NotificationsActiveIcon sx={{ color: '#000', fontSize: 22 }} />
                      <Typography fontWeight={700}>{urgentAttentionLabel}</Typography>
                    </Box>
                    {fakeUrgentAttention.map((item) => (
                      <UrgentCard key={item.id} item={item} />
                    ))}
                  </Box>
                )}

              {/* Tabs and Map */}
              <Container sx={{ width: '95%' }}>
                <Box sx={{ pt: 2 }}>
                  <ChromeTabs
                    selected={selectedTabIndex}
                    onTabChange={setSelectedTabIndex}
                    height={50}
                    customWidth="100%"
                  />
                </Box>
                <Box sx={{ pb: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '0 0 16px 16px',
                      border: selectedTabIndex === 0 ? '2px solid #000000ff' : 'none',
                      borderTop: selectedTabIndex === 0 ? '0px' : undefined,
                      minHeight: 400,
                    }}
                  >
                    {selectedTabIndex === 0 ? (
                      <MapView
                        properties={applications}
                        selectedMarkerIdx={selectedMarkerIdx}
                        setSelectedMarkerIdx={setSelectedMarkerIdx}
                      />
                    ) : (
                      <PropertyList properties={applications} />
                    )}
                  </Paper>
                </Box>
                <Box paddingTop={1} paddingBottom={4} width="50%">
                  <Button
                    onClick={handleAddNewProperty}
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: '#c84c0e',
                      color: '#fff',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    + {addNewPropertyLabel}
                  </Button>
                </Box>
              </Container>
              {/* Urgent Attention Section again (dummy, implement logic if required) */}
              {Array.isArray(fakeUrgentAttention) &&
                (fakeUrgentAttention.length === 0 || fakeUrgentAttention.length > 3) && (
                  <Box px={3} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <NotificationsActiveIcon sx={{ color: '#000', fontSize: 22 }} />
                      <Typography fontWeight={700}>{urgentAttentionLabel}</Typography>
                    </Box>
                    {fakeUrgentAttention.map((item) => (
                      <UrgentCard key={item.id} item={item} />
                    ))}
                  </Box>
                )}
            </Box>
          ) : (
            <Box>
              {/* Top row */}
              <Box display="flex" justifyContent="flex-end" gap={0.2} mb={2}>
                {/* Language Section with Dropdown */}
                <Box textAlign="center">
                  <IconButton
                    onClick={handleLangClick}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                    }}
                  >
                    <img
                      src={translateIndicSvg}
                      alt="Language"
                      width={35}
                      height={35}
                      style={{ display: 'block', margin: '0 auto' }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {languageLabel}
                    </Typography>
                  </IconButton>
                  <Menu
                    anchorEl={langMenuAnchor}
                    open={Boolean(langMenuAnchor)}
                    onClose={handleLangClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <MenuItem
                      selected={lang === 'en'}
                      onClick={() => handleLangSelect('en')}
                    >
                      English
                    </MenuItem>
                    <MenuItem
                      selected={lang === 'hi'}
                      onClick={() => handleLangSelect('hi')}
                    >
                      हिन्दी
                    </MenuItem>
                    <MenuItem
                      selected={lang === 'kn'}
                      onClick={() => handleLangSelect('kn')}
                    >
                      ಕನ್ನಡ
                    </MenuItem>
                  </Menu>
                </Box>
                {/* Notification Section */}
                <Box textAlign="center">
                  <IconButton
                    onClick={() => {}}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                      boxShadow: 'none',
                      background: 'none',
                      minWidth: 0,
                      '&:hover': { background: 'none' },
                    }}
                  >
                    <Paper
                      sx={{
                        bgcolor: '#C84C0E',
                        borderRadius: '50%',
                        width: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'none',
                      }}
                      elevation={0}
                    >
                      <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 22 }} />
                    </Paper>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {notificationLabel}
                    </Typography>
                  </IconButton>
                </Box>
                {/* Profile Section */}
                <Box textAlign="center" sx={{ paddingRight: 2 }}>
                  <IconButton
                    onClick={() => navigate('/profile')}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0.5,
                      boxShadow: 'none',
                      background: 'none',
                      minWidth: 0,
                      '&:hover': { background: 'none' },
                    }}
                  >
                    <Paper
                      sx={{
                        bgcolor: '#ffffff',
                        borderRadius: '50%',
                        width: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'none',
                      }}
                      elevation={0}
                    >
                      <AccountCircleOutlinedIcon sx={{ color: '#000', fontSize: 40 }} />
                    </Paper>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10px' }}>
                      {profileLabel}
                    </Typography>
                  </IconButton>
                </Box>
              </Box>

              {/* Main Title */}
              <Typography variant="h5" fontWeight={700} pl={3} mb={2}>
                {myPropertiesLabel}
              </Typography>

              {/* Map with search bar overlay */}
              <Box px={3} mb={2}>
                <Box sx={{ position: 'relative' }}>
                  <MapView
                    properties={[]}
                    selectedMarkerIdx={selectedMarkerIdx}
                    setSelectedMarkerIdx={setSelectedMarkerIdx}
                    center={NEW_USER_BANGALORE_CENTER}
                    height={400}
                    showEmptyMessage
                    zoom={15}
                  />
                  {/* Search bar overlay */}
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      right: 20,
                      height: 47,
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      boxShadow: '0 1px 7px rgba(0,0,0,0.13)',
                      backdropFilter: 'blur(0.2px)',
                      bgcolor: 'rgba(255,255,255,0.75)',
                      zIndex: 100,
                    }}
                    elevation={4}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      slotProps={{
                        input: SEARCH_INPUT_PROPS,
                      }}
                      sx={{
                        // Input text styles
                        '& .MuiInputBase-input': {
                          fontWeight: 500,
                          fontSize: 18,
                          color: '#222',
                          border: 'none !important',
                          boxShadow: 'none',
                          outline: 'none',
                          background: 'transparent',
                        },
                        // Remove any border from root
                        '& .MuiInputBase-root': {
                          border: 'none !important',
                          boxShadow: 'none',
                          outline: 'none',
                          background: 'transparent',
                        },
                        // Remove underline from standard variant
                        '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                          borderBottom: 'none !important',
                        },
                      }}
                    />
                  </Paper>
                </Box>
              </Box>

              {/* Add New Property button */}
              <Box px={3} paddingTop={1} paddingBottom={4} width="70%">
                <Button
                  onClick={handleAddNewProperty}
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#c84c0e',
                    color: '#fff',
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  + {addNewPropertyLabel}
                </Button>
              </Box>

              {/* Urgent Attention */}
              <Box px={3} mt={2} mb={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <NotificationsActiveIcon sx={{ color: '#000', fontSize: 21 }} />
                  <Typography fontWeight={700} fontSize={17}>
                    {urgentAttentionLabel}
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    bgcolor: '#D3FFD6',
                    borderRadius: 1.5,
                    border: '1px solid #8CCD9A',
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    mb: 2,
                  }}
                  elevation={0}
                >
                  <NotificationsActiveIcon
                    sx={{ color: '#3c9450', fontSize: 22, mr: 1 }}
                  />
                  <Typography
                    sx={{ color: '#228c50', fontWeight: 500, fontSize: 14, flex: 1 }}
                  >
                    Begin registration of properties to begin enumeration process
                  </Typography>
                  <Typography
                    sx={{ color: '#888', fontWeight: 500, fontSize: 12, ml: 2 }}
                  >
                    {new Date().toISOString().split('T')[0]}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </Box>
        <BottomBar />
      </Container>
    </>
  );
};

// Export the CitizenHomePage component as default
export default CitizenHomePage;
