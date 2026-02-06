import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

// Mock data for Storybook
const mockUserProfile = {
  firstName: 'Anita',
  lastName: 'Sharma',
  fullName: 'Anita Sharma',
  email: 'anita.sharma@example.com',
  phoneNumber: '9876543210',
  createdDate: '2020-06-15T10:30:00Z',
  profile: {
    firstName: 'Anita',
    lastName: 'Sharma',
    fullName: 'Anita Sharma',
    phoneNumber: '9876543210',
    adhaarNo: 123456789012,
    address: {
      addressLine1: 'Plot 567, 27th Main Road',
      addressLine2: 'HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560102',
    },
  },
  address: {
    addressLine1: 'Plot 567, 27th Main Road',
    addressLine2: 'HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560102',
  },
  zoneData: [
    { zoneNumber: '24', wards: ['Ward 24A', 'Ward 24B'] },
    { zoneNumber: '38', wards: ['Ward 38A'] },
  ],
};

const mockAgentProfile = {
  firstName: 'Rajesh',
  lastName: 'Kumar',
  fullName: 'Rajesh Kumar',
  email: 'rajesh.kumar@agent.com',
  phoneNumber: '8765432109',
  createdDate: '2019-03-20T08:15:00Z',
  profile: {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    fullName: 'Rajesh Kumar',
    phoneNumber: '8765432109',
    adhaarNo: 987654321098,
  },
  zoneData: [
    { zoneNumber: '24', wards: ['Ward 24A', 'Ward 24B'] },
    { zoneNumber: '46', wards: ['Ward 46A'] },
  ],
};

// Mock constants
const COLORS = {
  border: '#E0E0E0',
  bg: '#FFFFFF',
  profileBg: '#F5F5F5',
  text: '#333333',
  verified: '#4CAF50',
};

// Mock localization messages
const messages = {
  'personal-details': 'Personal Details',
  'phone-number': 'Phone Number',
  'residential-address': 'Residential Address',
  'jurisdiction': 'Jurisdiction',
  'properties': 'Properties',
  'licenses': 'Licenses',
  'member-since': 'Member Since',
  'verified-owner': 'Verified Owner',
  'verified-agent': 'Verified Agent',
  'email-address': 'Email Address',
};

// Self-contained ProfileCard component for Storybook
const ProfileCardStorybook: React.FC<{
  isCitizenProfile: boolean;
  noOfProperties: number;
  noActiveLicenses: number;
  userProfile?: any;
}> = ({ isCitizenProfile, noOfProperties, noActiveLicenses, userProfile }) => {
  const [displayProfile, setDisplayProfile] = useState<any>(null);

  useEffect(() => {
    // Use provided userProfile or default based on profile type
    const profile = userProfile || (isCitizenProfile ? mockUserProfile : mockAgentProfile);
    setDisplayProfile(profile);
  }, [isCitizenProfile, userProfile]);

  if (!displayProfile) return null;

  // Extract main profile fields
  const firstName = displayProfile.profile?.firstName || displayProfile.firstName || '';
  const lastName = displayProfile.profile?.lastName || displayProfile.lastName || '';
  const fullName = displayProfile.profile?.fullName || displayProfile.fullName || `${firstName} ${lastName}`.trim();
  const phoneNumber = displayProfile.profile?.phoneNumber || displayProfile.phoneNumber || '';
  const aadharNo = displayProfile.profile?.adhaarNo;
  const email = displayProfile.email;
  const address = displayProfile.profile?.address || displayProfile.address;
  const zoneData = displayProfile.zoneData || [];
  const allWards = zoneData.flatMap((z: any) => z.wards).join(', ');
  const allZones = zoneData.map((z: any) => z.zoneNumber).join(', ');

  // Helper to format address for display
  const formatAddress = (address: any): string => {
    if (!address) return 'Plot 567, 27th Main Road, HSR Layout';
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pinCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address not provided';
  };

  // Format member since date
  const formatMemberSince = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const memberSince = formatMemberSince(displayProfile.createdDate);

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: 2.5,
        width: '93vw',
        background: COLORS.bg,
        margin: '4px',
        position: 'relative',
      }}
    >
      {/* Header row with label and edit button */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography fontWeight={700} fontSize={20} color="#757575">
          {messages['personal-details']}
        </Typography>
        <IconButton onClick={() => console.log('Edit profile')}>
          <EditIcon fontSize="medium" sx={{ color: '#757575' }} />
        </IconButton>
      </Box>

      {/* Main profile info row with avatar, name, verification status, and phone */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: COLORS.profileBg,
          borderRadius: '40px',
          mt: 2,
          mb: 2,
          boxShadow: '0px 4px 8px 0px #00000033',
          height: 80,
          p: 2,
          minWidth: '0.8vw',
        }}
      >
        <AccountCircleOutlinedIcon 
          sx={{ 
            fontSize: 54, 
            mr: 2, 
            color: COLORS.text, 
            backgroundColor: COLORS.bg, 
            borderRadius: '50%' 
          }} 
        />
        <Box>
          <Typography fontWeight={700} fontSize={22} color={COLORS.text}>
            {fullName || 'Name not available'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: COLORS.verified }} />
            <Typography fontWeight={600} fontSize={16} color={COLORS.verified}>
              {isCitizenProfile ? messages['verified-owner'] : messages['verified-agent']}
            </Typography>
          </Box>

          {/* Masked Aadhar number for citizen profile */}
          {isCitizenProfile && aadharNo && (
            <Typography fontSize={15} color="#666">
              {`${aadharNo.toString().slice(0, 4)} **** ***${aadharNo.toString().slice(-1)}`}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Contact info and address/jurisdiction section */}
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight={400} fontSize={10} color="hsla(0, 0%, 0%, 0.50)">
          {messages['email-address']}:
        </Typography>
        <Typography fontSize={16} color={COLORS.text}>
          {email || 'Email not available'}
        </Typography>

        <Typography
          fontWeight={400}
          fontSize={10}
          color="hsla(0, 0%, 0%, 0.50)"
          sx={{ mt: 1 }}
        >
          {messages['phone-number']}:
        </Typography>
        <Typography fontSize={16} color={COLORS.text}>
          {phoneNumber || 'Phone not available'}
        </Typography>

        {/* Citizen: show address, Agent: show jurisdiction */}
        {isCitizenProfile && (
          <>
            <Typography
              fontWeight={400}
              fontSize={10}
              color="hsla(0, 0%, 0%, 0.50)"
              sx={{ mt: 1 }}
            >
              {messages['residential-address']}:
            </Typography>
            <Typography fontSize={16} color={COLORS.text}>
              {formatAddress(address)}
            </Typography>
          </>
        )}

        {!isCitizenProfile && (
          <Box>
            <Typography
              fontWeight={500}
              fontSize={10}
              color="hsla(0, 0%, 0%, 0.50)"
              sx={{ mt: 1 }}
            >
              {messages['jurisdiction']}:
            </Typography>
            <Typography fontWeight={400} fontSize={14} color={COLORS.text}>
              {`Zone Nos : ${allZones || 'N/A'}`}
            </Typography>
            <Typography fontWeight={400} fontSize={14} color={COLORS.text}>
              {`Ward Nos : ${allWards || 'N/A'}`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Citizen: show summary stats (properties, licenses, member since) */}
      {isCitizenProfile && (
        <Box
          sx={{
            background: COLORS.profileBg,
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            py: 1.5,
            mt: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700} fontSize={22} color={COLORS.text}>
              {noOfProperties}
            </Typography>
            <Typography fontSize={14} color="#757575">
              {messages['properties']}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700} fontSize={22} color={COLORS.text}>
              {noActiveLicenses}
            </Typography>
            <Typography fontSize={14} color="#757575">
              {messages['licenses']}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontSize={16} color="#757575">
              {messages['member-since']}
            </Typography>
            <Typography fontWeight={700} fontSize={17} color={COLORS.text}>
              {memberSince}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// Storybook Meta
const meta: Meta<typeof ProfileCardStorybook> = {
  title: 'Common/ProfileCard',
  component: ProfileCardStorybook,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isCitizenProfile: {
      control: 'boolean',
      description: 'Whether to show citizen or agent profile layout',
    },
    noOfProperties: {
      control: { type: 'number', min: 0 },
      description: 'Number of properties (citizen only)',
    },
    noActiveLicenses: {
      control: { type: 'number', min: 0 },
      description: 'Number of active licenses (citizen only)',
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProfileCardStorybook>;

// Stories
export const CitizenProfile: Story = {
  args: {
    isCitizenProfile: true,
    noOfProperties: 3,
    noActiveLicenses: 2,
  },
};

export const AgentProfile: Story = {
  args: {
    isCitizenProfile: false,
    noOfProperties: 0,
    noActiveLicenses: 0,
  },
};

export const CitizenWithManyProperties: Story = {
  args: {
    isCitizenProfile: true,
    noOfProperties: 12,
    noActiveLicenses: 5,
  },
};

export const NewCitizen: Story = {
  args: {
    isCitizenProfile: true,
    noOfProperties: 0,
    noActiveLicenses: 0,
    userProfile: {
      ...mockUserProfile,
      createdDate: new Date().toISOString(),
    },
  },
};