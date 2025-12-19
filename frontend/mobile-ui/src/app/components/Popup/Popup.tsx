
// Popup component displays a modal notification with icon, title, and message
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import type { PopupProps } from '../../models/Popup.model';


// Maps popup type to corresponding icon
const iconMap: Record<string, React.ReactElement> = {
  alert: <WarningAmberIcon sx={{ color: '#0057BD' }} />,
  information: <InfoIcon sx={{ color: '#CB9C00' }} />,
  warning: <ErrorIcon sx={{ color: '#A30222' }} />,
  success: <CircleNotificationsOutlinedIcon sx={{ color: '#00703C' }} />,
};


// Maps popup type to accent color and background
const stylesMap: Record<string, { borderColor: string; bg?: string }> = {
  alert: { borderColor: '#0057BD', bg: '#FFFFFF' },
  information: { borderColor: '#CB9C00', bg: '#FFFFFF' },
  warning: { borderColor: '#A30222', bg: '#FFFFFF' },
  success: { borderColor: '#00703C', bg: '#FFFFFF' },
};


// Popup functional component
export const Popup: React.FC<PopupProps> = ({
  type = 'information', // Type of popup (alert, information, warning, success)
  title,
  message,
  open,
  duration = 3000, // Duration in ms before auto-close
}) => {
  // Internal visibility state for animation and auto-close
  const [visible, setVisible] = useState(open);

  // Sync visibility with open prop
  useEffect(() => {
    setVisible(open);
  }, [open]);

  // Auto-close after duration if visible
  useEffect(() => {
    if (!visible) return;
    if (duration > 0) {
      const timer = window.setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  // Get accent color for left border
  const accentColor = stylesMap[type]?.borderColor ?? '#ccc';

  // Render MUI Modal with Fade transition and custom styling
  return (
    <Modal
      open={visible}
      onClose={() => {
        setVisible(false);
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 200,
          sx: { backgroundColor: 'transparent' },
        },
      }}
      aria-labelledby="popup-title"
      aria-describedby="popup-message"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: (theme) => theme.zIndex.modal + 100,
      }}
    >
      <Fade in={visible} timeout={200}>
        <Box
          role="status"
          aria-live="polite"
          sx={{
            marginTop: 6,
            width: 'min(92%, 480px)',
            pointerEvents: 'auto',
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
            p: 2.5,
            borderRadius: 2,
            // Only show a visible left border (accent)
            border: 'none',
            borderLeft: `3px solid ${accentColor}`,
            outline: 'none',
            bgcolor: stylesMap[type]?.bg ?? '#fff',
            boxShadow: 6,
          }}
        >
          {/* Icon for the popup type */}
          <Box sx={{ mt: 0.5 }}>{iconMap[type]}</Box>

          {/* Content: title and message */}
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography
                id="popup-title"
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color:
                    type === 'alert'
                      ? '#0057BD'
                      : type === 'information'
                      ? '#CB9C00'
                      : type === 'warning'
                      ? '#A30222'
                      : '#00703C',
                }}
              >
                {title}
              </Typography>
            )}
            {message && (
              <Typography id="popup-message" variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// Export the Popup component as default
export default Popup;