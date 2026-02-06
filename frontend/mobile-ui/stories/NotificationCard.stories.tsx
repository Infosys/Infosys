import type { Meta, StoryObj } from "@storybook/react";
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

// Self-contained component for Storybook that mimics NotificationSettings
const NotificationSettingsStorybook: React.FC<{ isCitizenProfile: boolean }> = ({ isCitizenProfile }) => {
  // State to track which delivery methods are selected
  const [deliveryMethods, setDeliveryMethods] = useState({
    sms: false,
    whatsapp: false,
    email: false,
  });

  // Handler to update delivery method selection
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDeliveryMethods((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const notificationCategories = isCitizenProfile
    ? [
        {
          key: 'bill-reminders',
          title: 'Bill Reminders',
          desc: 'Receive reminders for unpaid bills.',
        },
        {
          key: 'license-expiry',
          title: 'License Expiry',
          desc: 'Get notified before licenses expire.',
        },
        {
          key: 'service-updates',
          title: 'Service Updates',
          desc: 'Updates about services in your area.',
        },
        {
          key: 'community-news',
          title: 'Community News',
          desc: 'News and announcements from the community.',
        },
      ]
    : [
        {
          key: 'application-updates',
          title: 'Application Updates',
          desc: 'Status updates for submitted applications.',
        },
        {
          key: 'appointment-scheduling',
          title: 'Appointment Scheduling',
          desc: 'Notifications about scheduled appointments.',
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
        border: '1px solid #E0E0E0',
        borderRadius: '10px',
        padding: 2.5,
        width: '93vw',
        background: '#FFFFFF',
        margin: '8px 4px',
        position: 'relative',
      }}
    >
      {/* Header with icon and title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NotificationsNoneIcon sx={{ mr: 1, color: '#757575' }} />
        <Typography fontWeight={300} fontSize={24} color="#333">
          Notification Settings
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
              <Typography fontWeight={700} fontSize={18} color="#333">
                {item.title}
              </Typography>
              <Typography fontSize={16} color="#444">
                {item.desc}
              </Typography>
            </Box>
            <Switch
              checked={toggles[item.key]}
              onChange={handleToggleChange(item.key)}
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: toggles[item.key] ? '#C7501B' : '#ECECEC',
                  opacity: 1,
                  height: 22,
                  borderRadius: 11,
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: '#fff',
                  width: 18,
                  height: 18,
                  boxShadow: 'none',
                  border: '1px solid #C7501B',
                },
                '& .MuiSwitch-switchBase.Mui-checked': {
                  paddingTop: 1.74,
                  paddingLeft: 0.75,
                },
                '& .MuiSwitch-switchBase': {
                  padding: 1.77,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#C7501B',
                  opacity: 1,
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Delivery methods section with checkboxes for SMS, WhatsApp, Email */}
      <Box
        sx={{
          borderTop: '1.5px solid #E0E0E0',
          my: 2,
          pt: 1,
          paddingLeft: 4,
        }}
      >
        <Typography fontWeight={700} fontSize={17} color="#333" mb={1}>
          Delivery Methods
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
                  color: '#333',
                  '&.Mui-checked': { color: '#C7501B' },
                }}
              />
            }
            label={
              <Typography fontSize={17} color="#333">
                SMS Notifications
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
                  color: '#333',
                  '&.Mui-checked': { color: '#C7501B' },
                }}
              />
            }
            label={
              <Typography fontSize={17} color="#333">
                WhatsApp Notifications
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
                  color: '#333',
                  '&.Mui-checked': { color: '#C7501B' },
                }}
              />
            }
            label={
              <Typography fontSize={17} color="#333">
                Email Notifications
              </Typography>
            }
          />
        </Box>
      </Box>
    </Paper>
  );
};

const meta: Meta<typeof NotificationSettingsStorybook> = {
  title: "Common/Notifications",
  component: NotificationSettingsStorybook,
  argTypes: {
    isCitizenProfile: {
      control: 'boolean',
      description: 'Toggle between Citizen and Agent profile modes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof NotificationSettingsStorybook>;

export const Citizen: Story = {
  args: {
    isCitizenProfile: true,
  },
};

export const Agent: Story = {
  args: {
    isCitizenProfile: false,
  },
};