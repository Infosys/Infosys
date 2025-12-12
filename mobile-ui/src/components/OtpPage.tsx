// OtpPage.tsx
// OTP verification page for user authentication. Handles OTP input, validation, error display, and navigation on success.
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlineRoundedIcon from '@mui/icons-material/LockOutlineRounded';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { useNavigate } from 'react-router-dom';
import { useSignUpForm } from '../context/SignUpFormContext';
import '../styles/OtpPage.css';
import authService from '../services/AuthService';
import { useAuth } from '../context/AuthProvider';
import { useLocalization } from '../services/Citizen/Localization/LocalizationContext';
// import { toast } from 'react-toastify';
import '../styles/Toaster/toaster.css';
import { useLoginLocalization } from '../services/Citizen/Localization/useLocalization';
import type { AlertType } from '../app/models/AlertType.model';
import { NotificationPopup } from '../app/components/Popup/NotificationPopup';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * OtpPage Component
 * Renders the OTP verification UI, manages OTP input fields, handles OTP validation,
 * displays error popups, and navigates to the home page on successful verification.
 */
export default function OtpPage() {
  // Get current language and localization function
  const lang = localStorage.getItem('loginLocale');
  const { t } = useLoginLocalization(lang!);
  // Auth state updater
  const { updateAuthState } = useAuth();
  // Refs for each OTP input field
  const otpRefs = Array.from({ length: 4 }, () => useRef<HTMLInputElement>(null));
  // State for OTP input values
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  // const [error, setError] = useState('');
  // Navigation hook
  const navigate = useNavigate();
  // Get OTP and username from sign-up form context
  const { otp, username } = useSignUpForm();
  // Localization refresh function
  const { refresh } = useLocalization();
  // const [showPopup, setShowPopup] = useState(false);

  // State for notification popup (error/info)
  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>(
    {
      type: 'warning',
      open: false,
      title: '',
      message: '',
      duration: 3000,
    }
  );

  /**
   * Show error popup with a custom message and duration
   */
  function showErrorPopup(message: string, duration = 3000) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: 'warning',
        open: true,
        title: 'Incorrect OTP!',
        message,
        duration,
      });
    }, 10);
  }

  /**
   * Handle input changes for OTP fields
   * Only allows numeric input, auto-focuses next field on entry
   */
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otpValues];
    newOtp[idx] = val;
    setOtpValues(newOtp);

    // Move focus to next input if value entered
    if (val && idx < otpRefs.length - 1) {
      otpRefs[idx + 1].current?.focus();
    }
    // setError(''); // Clear error on change
  };

  /**
   * Handle keyboard navigation for OTP fields
   * Moves focus to previous field on backspace
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  /**
   * Handle verify button click
   * Validates OTP, logs in user, updates auth state, and navigates to home on success.
   * Shows error popup on failure.
   */
  const handleVerifyClick = async () => {
    const enteredOtp = otpValues.join('');
    if (enteredOtp === otp) {
      // setError('');
      await authService.loginWithPassword({ username: username, password: enteredOtp });
      await updateAuthState();

      // When OTP is verified and navigating to home page
      sessionStorage.setItem('showWelcomePopup', 'true');

      navigate('/citizen');
      refresh();
    } else {
      // setError(t('incorrect-otp','Incorrect OTP. Please try again.'));
      showErrorPopup(t('incorrect-otp', 'Incorrect OTP. Please try again.'));
    }
  };

  // Render OTP verification UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-lock">
            <LockOutlineRoundedIcon style={{ fontSize: 36, color: '#ca5407' }} />
          </div>
          <h2 className="verify-title">{t('verify-identity', 'Verify your Identity')}</h2>
          <div className="verify-info-box">
            <InfoOutlinedIcon className="mui-icon" />
            <span>
              {t(
                'otp-send-message',
                "We'll send an OTP to the Employee Email linked with your User name for verification."
              )}
            </span>
          </div>
          <div className="otp-input-row">
            {otpRefs.map((ref, idx) => (
              <input
                key={idx}
                ref={ref}
                type="text"
                maxLength={1}
                className="otp-input"
                value={otpValues[idx]}
                onChange={(e) => handleOtpChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {/* {error && <div className="otp-error-message">{error}</div>} */}
          <button className="resend-btn" type="button">
            {t('resend-otp', 'RESEND OTP')}
          </button>
          <button className="verify-btn" type="button" onClick={handleVerifyClick}>
            {t('verify', 'Verify')}
          </button>
          <div style={{ alignContent: 'start' }}>
            <div className="verify-secure-row">
              <TaskAltOutlinedIcon className="secure-icon" />
              <span>{t('data-enc-message', 'Your data is Secure and encrypted')}</span>
            </div>
            <div className="verify-secure-row">
              <TaskAltOutlinedIcon className="secure-icon" />
              <span>
                {t(
                  'verify-identity-message',
                  'We only verify your indentity, no data is stored'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
