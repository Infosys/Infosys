// NotificationSettings is a reusable settings card for notification preferences.
// It displays notification categories (different for Citizen and Agent) and allows users to select delivery methods (SMS, WhatsApp, Email).
// The component uses localization for all labels and adapts to the current language and role.
// Used in profile/settings screens for both Citizen and Agent interfaces.
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Checkbox,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { getAppLocale } from '../../services/Profile/ProfileService';
import { getMessagesFromSession } from '../../services/Citizen/Localization/LocalizationContext';
import { COLORS } from '../models/Colors.const';

export const NotificationSettings: React.FC<{ isCitizenProfile: boolean }> = ({
  isCitizenProfile,
}) => {
  // State to track which delivery methods are selected
  const [deliveryMethods, setDeliveryMethods] = useState({
    sms: false,
    whatsapp: false,
    email: false,
  });

  // Get current language and localized messages for the role
  const lang = getAppLocale();
  const messages = getMessagesFromSession(isCitizenProfile ? 'CITIZEN' : 'AGENT')!;

  // Handler to update delivery method selection
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDeliveryMethods((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (checked) {
      console.log(`${name} checkbox checked`);
    }
  };

  const notificationCategories = isCitizenProfile
    ? [
        {
          key: 'bill-reminders',
          title: messages['profile'][lang]['bill-reminders'],
          desc: messages['profile'][lang]['bill-reminders-desc'],
        },
        {
          key: 'license-expiry',
          title: messages['profile'][lang]['license-expiry'],
          desc: messages['profile'][lang]['license-expiry-desc'],
        },
        {
          key: 'service-updates',
          title: messages['profile'][lang]['service-updates'],
          desc: messages['profile'][lang]['service-updates-desc'],
        },
        {
          key: 'community-news',
          title: messages['profile'][lang]['community-news'],
          desc: messages['profile'][lang]['community-news-desc'],
        },
      ]
    : [
        {
          key: 'application-updates',
          title: 'application-updates',
          desc: 'application-updates-desc',
        },
        {
          key: 'appointment-scheduling',
          title: 'appointment-scheduling',
          desc: 'appointment-scheduling-desc',
        },
      ];

  // Initialize toggles state with all categories enabled
  const [toggles, setToggles] = useState(
    Object.fromEntries(notificationCategories.map((cat) => [cat.key, true]))
  );

  const handleToggleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setToggles((prev) => ({
        ...prev,
        [key]: event.target.checked,
      }));
    };
  return (
    // Paper provides a styled card container for notification settings
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: 2.5,
        width: '93vw',
        background: COLORS.bg,
        margin: '8px 4px',
        position: 'relative',
      }}
    >
      {/* Header with icon and title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NotificationsNoneIcon sx={{ mr: 1, color: '#757575' }} />
        <Typography fontWeight={500} fontSize={24} color={COLORS.text}>
          {/* Notification Settings */}
          {messages['profile'][lang]['notification-settings']}
        </Typography>
      </Box>
      {/* Notification categories (different for Citizen and Agent) */}
      <Box sx={{ paddingLeft: 4 }}>
        {notificationCategories.map((item) => (
          // Each notification category with title, description, and toggle switch
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={700} fontSize={18} color={COLORS.text}>
                {item.title}
              </Typography>
              <Typography fontSize={16} color="#444">
                {item.desc}
              </Typography>
            </Box>
            <Switch
              checked={toggles[item.key]}
              onChange={handleToggleChange(item.key)}
              color="warning"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: COLORS.toggle,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: COLORS.toggle,
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Delivery methods section with checkboxes for SMS, WhatsApp, Email */}
      <Box
        sx={{
          borderTop: `1.5px solid ${COLORS.border}`,
          my: 2,
          pt: 1,
          paddingLeft: 4,
        }}
      >
        <Typography fontWeight={700} fontSize={17} color={COLORS.text} mb={1}>
          {/* Delivery Methods */}
          {messages['profile'][lang]['delivery-methods']}
        </Typography>
        <Box display="flex" flexDirection="column">
          {/* SMS Notifications checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={deliveryMethods.sms}
                onChange={handleCheckboxChange}
                name="sms"
                sx={{
                  color: COLORS.toggle,
                  '&.Mui-checked': { color: COLORS.toggle },
                }}
              />
            }
            label={
              <Typography fontSize={17} color={COLORS.text}>
                {/* SMS Notifications */}
                {messages['profile'][lang]['sms-notifications']}
              </Typography>
            }
          />
          {/* WhatsApp Notifications checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={deliveryMethods.whatsapp}
                onChange={handleCheckboxChange}
                name="whatsapp"
                sx={{
                  color: COLORS.toggle,
                  '&.Mui-checked': { color: COLORS.toggle },
                }}
              />
            }
            label={
              <Typography fontSize={17} color={COLORS.text}>
                {/* Whatsapp Notifications */}
                {messages['profile'][lang]['whatsapp-notifications']}
              </Typography>
            }
          />
          {/* Email Notifications checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={deliveryMethods.email}
                onChange={handleCheckboxChange}
                name="email"
                sx={{
                  color: COLORS.toggle,
                  '&.Mui-checked': { color: COLORS.toggle },
                }}
              />
            }
            label={
              <Typography fontSize={17} color={COLORS.text}>
                {/* Email Notifications */}
                {messages['profile'][lang]['email-notifications']}
              </Typography>
            }
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationSettings;
