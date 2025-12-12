// LoginPage.tsx
// This component renders the login page for both agents and citizens.
// Handles login logic, validation, localization, and UI switching between agent and citizen tabs.
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
  // Alert,
  Link,
  Fade,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoginTabs from '../../components/Login-Screen/LoginTabs';
import { PhoneLoginService } from '../../services/PhoneLoginService';
import { useSignUpForm } from '../../context/SignUpFormContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/AuthService';
import { LoginHeaderWithLanguage } from '../../components/Login-Screen/LoginHeaderWithLanguage';
import { LanguageSettingsModal } from '../../components/Login-Screen/LanguageSettingsModal';
import { useLoginLocalization } from '../../services/Citizen/Localization/useLocalization';
import type { AlertType } from '../../app/models/AlertType.model';
import '../../styles/PasswordField.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { NotificationPopup } from '../../app/components/Popup/NotificationPopup';

const PRIMARY_ORANGE = '#C84C0E';
const PAGE_BG = '#E5E5E5';
const CONTAINER_BG = '#FFFFFF';

// Helper to validate agent username format
function isValidUsername(username: string) {
  if (username.length < 2) return false;
  return /^[A-Za-z][A-Za-z0-9._-]*[A-Za-z0-9]$/.test(username);
}

// Helper to validate Indian phone number format
function isValidPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

// Props for LoginScreen component
interface LoginFormProps {
  onLoginSuccess: () => void;
}

/**
 * LoginScreen component
 * Renders login UI for agent and citizen, manages state, validation, and handles login logic.
 */
export default function LoginScreen({ onLoginSuccess }: LoginFormProps) {
  // Set default login locale if not present
  localStorage.setItem('loginLocale', localStorage.getItem('loginLocale') || 'en');
  // State for language modal and selected language
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('loginLocale') || 'en'
  );

  // Localization hook for login page
  const { t } = useLoginLocalization(selectedLanguage);

  // const [error, setError] = useState('');
  // const [showAlert, setShowAlert] = useState(false);
  
  // Context and navigation hooks
  const { setUsername: setFormUsername, setOtp } = useSignUpForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role')?.toLowerCase() === 'agent' ? 'agent' : 'citizen') as 'agent' | 'citizen';
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'agent' | 'citizen'>(initialRole);
  const [fadeKey, setFadeKey] = useState(0);

  

  // State for agent login fields
  const [agentUsername, setAgentUsername] = useState('');
  const [showAgentUsernameError, setShowAgentUsernameError] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State for citizen login fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneError, setShowPhoneError] = useState(false);

  // State for notification popup
  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: 'warning',
    open: false,
    title: '',
    message: '',
    duration: 3000,
  });

  

  // Update URL search params when login type changes
  useEffect(() => {
    const popup = sessionStorage.getItem("signupSuccessMessage");
    if (popup) {
      setPopup({
        type: 'success',
        open: true,
        title: 'Signup Successful',
        message: popup,
        duration: 3000,
      });
      sessionStorage.removeItem("signupSuccessMessage");
    }


    const roleParam = loginType === 'agent' ? 'Agent' : 'Citizen';
    setSearchParams({ role: roleParam }, { replace: true });
  }, [loginType, setSearchParams]);

  // Helper to show error notification popup
  function showErrorPopup(message: string, duration = 3000, title?: string,) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: 'warning',
        open: true,
        title: title || 'Error Encountered!',
        message,
        duration,
      });
    }, 10);
  }

  /**
   * Handles agent login: validates input, calls authService, and navigates on success.
   */
  const handleAgentLogin = async () => {
    if (agentUsername === '' || password === '') {
      showErrorPopup('Please enter both username and password.', 3000, 'Incomplete Details');
      return;
    }
    if (!isValidUsername(agentUsername)) {
      setShowAgentUsernameError(true);
      showErrorPopup(
        'Username must start with an alphabet and end with a letter/number.',
        3000,
        'Invalid Username'
      );
      return;
    }
    setShowAgentUsernameError(false);
    try {
      const credentials = {
        username: agentUsername,
        password: password,
      };
      const success = await authService.loginWithPassword(credentials);
      if (success) {
        // Store agent username in localStorage
        localStorage.setItem('agentUsername', agentUsername);

        sessionStorage.setItem('showWelcomePopup', 'true');
        navigate('/agent');
        onLoginSuccess();
      } else {
        showErrorPopup('Check User credentials!', 3000, 'Login Failed');
      }
    } catch {
      showErrorPopup('An unexpected error occurred!', 3000, 'Error');
    }
  };

  /**
   * Handles citizen login: validates phone, sends OTP, and navigates to OTP verification.
   */
  const handleCitizenLogin = async () => {
    if (!isValidPhone(phoneNumber)) {
      setShowPhoneError(true);
      showErrorPopup('Invalid Phone Number', 3000, 'Login failed');
      return;
    }
    setShowPhoneError(false);
    try {
      const result = await PhoneLoginService.sendOtp(phoneNumber);
      if (result.success) {
        // Store citizen phone number in localStorage
        sessionStorage.setItem('citizenPhoneNumber', phoneNumber);

        setOtp('8472');
        setFormUsername(result.data.users[0].username);
        navigate('/otp-verification', { state: { phone: phoneNumber } });
      } else {
          showErrorPopup(t('login-failed-number', 'Login failed, Check your number.'), 3000, 'Number Not Registered');
      }
    } catch {
      showErrorPopup(t('error-occurred', 'An error occurred. Please try again.'), 3000, 'Something went wrong.');
    }
  };

  // Handler for switching between agent and citizen tabs
  const handleTabSwitch = (tab: 'agent' | 'citizen') => {
    setLoginType(tab);
    setFadeKey(fadeKey + 1);
    setShowAgentUsernameError(false);
    setShowPhoneError(false);
    setPassword('');
    setPhoneNumber('');
    setAgentUsername('');
  };

  // Render the login page UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        duration={popup.duration}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          background: PAGE_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            width: '92vw',
            maxWidth: 370,
            background: CONTAINER_BG,
            borderRadius: '32px',
            p: '32px 16px',
            mx: '25px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxShadow: 'none',
          }}
        >
          <LoginHeaderWithLanguage
            t={t}
            LanguageButtonProp={{ onClick: () => setLangModalOpen(true), t }}
          />
          <LanguageSettingsModal
            open={langModalOpen}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
            onClose={() => setLangModalOpen(false)}
            onConfirm={() => setLangModalOpen(false)}
          />
          <Box
            sx={{
              mb: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <LoginTabs selected={loginType} onChange={handleTabSwitch} t={t} />
          </Box>

          <Fade
            in={loginType === 'agent'}
            key={fadeKey + '-agent-form'}
            timeout={250}
            unmountOnExit
          >
            <Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    fontWeight={500}
                    fontSize={16}
                    fontFamily="Roboto, sans-serif"
                  >
                    {t('user-name', 'User Name')}
                  </Typography>
                  <Typography color={PRIMARY_ORANGE} sx={{ fontWeight: 700, mx: 0.5 }}>
                    *
                  </Typography>
                  <IconButton size="small" sx={{ p: 0, ml: '2px' }}>
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: '#656565' }} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={agentUsername}
                  placeholder={t('enter-user-name', 'Enter Username')}
                  sx={{
                    mb: 0.2,
                    fontFamily: 'Roboto, sans-serif',
                    '& .MuiOutlinedInput-input': {
                      fontFamily: 'Roboto, sans-serif',
                      boxSizing: 'border-box !important',
                      minHeight: '48px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '16px !important',
                      boxSizing: 'border-box !important',
                    },
                  }}
                  onChange={(e) => {
                    setAgentUsername(e.target.value);
                    setShowAgentUsernameError(false);
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !isValidUsername(e.target.value)) {
                      setShowAgentUsernameError(true);
                    }
                  }}
                  error={showAgentUsernameError}
                />
                <Typography
                  fontSize={10}
                  fontFamily="Roboto, sans-serif"
                  sx={{
                    ml: 1,
                    mt: 0.1,
                    color: showAgentUsernameError ? '#D32F2F' : '#636363',
                    fontWeight: showAgentUsernameError ? 500 : 400,
                  }}
                >
                  {showAgentUsernameError
                    ? t(
                        'user-name-condition',
                        'Username must start with an alphabet and end with a letter/number.'
                      )
                    : t('enter-username-to-login', 'Enter username to login')}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    fontWeight={500}
                    fontSize={16}
                    fontFamily="Roboto, sans-serif"
                  >
                    {t('password', 'Password')}
                  </Typography>
                  <Typography color={PRIMARY_ORANGE} sx={{ fontWeight: 700, mx: 0.5 }}>
                    *
                  </Typography>
                </Box>
                {/* <TextField
                  id="login-password-input"
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  className="pass-reveal"
                  placeholder={t('enter-password', 'Enter Password')}
                  variant="outlined"
                  sx={{
                    mb: 0.3,
                    fontFamily: 'Roboto, sans-serif !important',
                    '& .MuiOutlinedInput-input': {
                      fontFamily: 'Roboto, sans-serif',
                      boxSizing: 'border-box !important',
                      minHeight: "48px",
                      borderRadius: '10px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '16px !important',
                      boxSizing: 'border-box !important',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C4C4C4 !important',
                      borderRadius: '10px !important',
                    },
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                <div style={{ position: 'relative', width: '100%', marginBottom: '2px' }}>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="pass-reveal"
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '8.5px 40px 8.5px 14px',
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C84C0E';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(0, 0, 0, 0.54)',
                    }}
                  >
                    {showPassword ? (
                      // Eye open icon (password visible)
                      <VisibilityOutlinedIcon />
                    ) : (
                      // Eye closed icon (password hidden)
                      <VisibilityOffOutlinedIcon />
                    )}
                  </button>
                </div>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pt: 2,
                    pb: 1,
                  }}
                >
                  <Link
                    href="#"
                    underline="none"
                    sx={{
                      color: PRIMARY_ORANGE,
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: '13.5px',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    {t('forgot-password', 'Forgot Password')}
                  </Link>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '60px',
                  width: '100%',
                }}
              >
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    background: PRIMARY_ORANGE,
                    width: '150px',
                    height: '38px',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: 16,
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: 'none',
                  }}
                  onClick={handleAgentLogin}
                >
                  {/* {t('verify', 'Verify')} */}
                  Login
                </Button>
              </Box>
            </Box>
          </Fade>

          <Fade
            in={loginType === 'citizen'}
            key={fadeKey + '-citizen-form'}
            timeout={250}
            unmountOnExit
          >
            <Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    fontWeight={500}
                    fontSize={16}
                    fontFamily="Roboto, sans-serif"
                  >
                    {t('phone-number', 'Phone Number')}
                  </Typography>
                  <Typography color={PRIMARY_ORANGE} sx={{ fontWeight: 700, mx: 0.5 }}>
                    *
                  </Typography>
                  <IconButton size="small" sx={{ p: 0, ml: '2px' }}>
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: '#656565' }} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={phoneNumber}
                  placeholder={t('phone-number', 'Enter Phone Number')}
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    mb: 0.2,
                    fontFamily: 'Roboto, sans-serif',
                    '& .MuiOutlinedInput-input': {
                      fontFamily: 'Roboto, sans-serif',
                      boxSizing: 'border-box !important',
                      minHeight: '48px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '16px !important',
                      boxSizing: 'border-box !important',
                    },
                  }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(val);
                    setShowPhoneError(false);
                  }}
                  onBlur={(e) => {
                    if (!isValidPhone(e.target.value)) {
                      setShowPhoneError(true);
                    } else {
                      setShowPhoneError(false);
                    }
                  }}
                  error={showPhoneError}
                />
                <Typography
                  fontSize={11.5}
                  fontFamily="Roboto, sans-serif"
                  sx={{
                    ml: 1,
                    mt: 0.1,
                    color: showPhoneError ? '#D32F2F' : '#636363',
                    fontWeight: showPhoneError ? 500 : 400,
                  }}
                >
                  {showPhoneError
                    ? t(
                        'enter-valid-number',
                        'Please enter a valid 10-digit Indian phone number'
                      )
                    : t(
                        'enter-phone-number-used-to-register',
                        'Enter Phone Number used to register'
                      )}
                </Typography>
              </Box>

              {/* {showAlert && (
                <Alert
                  icon={
                    <Box
                      sx={{
                        background: '#FFCE8B',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                      }}
                    >
                      <InfoOutlinedIcon sx={{ color: '#111', fontSize: 20 }} />
                    </Box>
                  }
                  severity="warning"
                  sx={{
                    background: '#FFEFD8',
                    color: '#444',
                    mt: 2,
                    mb: 2,
                    fontFamily: 'Roboto, sans-serif',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: 15,
                    alignItems: 'center',
                  }}
                >
                  {error ? error : 'Login failed, Check your number.'}
                </Alert>
              )} */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '60px',
                  width: '100%',
                }}
              >
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    background: PRIMARY_ORANGE,
                    width: '150px',
                    height: '38px',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: 16,
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: 'none',
                  }}
                  onClick={handleCitizenLogin}
                >
                  {t('verify', 'Verify')}
                </Button>
              </Box>
              <Button
                variant="text"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{
                  color: '#000000',
                  fontFamily: 'Roboto, sans-serif',
                  textTransform: 'none',
                  fontSize: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  mt: 1.5,
                }}
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {t('register-as-new-user', 'Register as New User')}
                </Typography>
              </Button>
            </Box>
          </Fade>
        </Paper>
      </Box>
    </>
  );
}
