// ProfileCard is a reusable card component for displaying user profile information.
// It adapts its layout and fields based on whether the user is a Citizen or Agent.
// Shows personal details, verification status, contact info, address/jurisdiction, and summary stats.
// Used in profile screens for both Citizen and Agent interfaces.
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import edit_square from '../../assets/icons/edit_square.svg';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { getUserFromSession } from '../../context/AuthProvider';
import { getAppLocale } from '../../services/Profile/ProfileService';
import { getMessagesFromSession } from '../../services/Citizen/Localization/LocalizationContext';
import { COLORS } from '../models/Colors.const';
import authService from '../../services/AuthService';
import type { Address, UserProfile } from '../models/UserProfile.mode';

export const ProfileCard: React.FC<{
  isCitizenProfile: boolean;
  noOfProperties: number;
  noActiveLicenses: number;
}> = ({ isCitizenProfile, noOfProperties, noActiveLicenses }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Get user from session (memoized)
  const sessionUser = useMemo(() => getUserFromSession(), []);
  // Determine role (Agent or Citizen)
  const role = authService.isAgent() ? 'AGENT' : 'CITIZEN';

  // Get current language and localized messages
  const lang = getAppLocale();
  const messages = getMessagesFromSession(role)!;

  // Localized labels for profile fields
  const personalDetailsLabel = messages['profile'][lang]['personal-details'];
  const personPhone = messages['profile'][lang]['phone-number'];
  const personAddress = messages['profile'][lang]['residential-address'];
  const personJurisdiction = messages['profile'][lang]['jurisdiction'];
  const personProperties = messages['profile'][lang]['properties'];
  const personLicenses = messages['profile'][lang]['licenses'];
  const personMemberSince = messages['profile'][lang]['member-since'];

  // Load user profile from session storage on mount or when profile type changes
  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    setUserProfile(user);
  }, [isCitizenProfile, sessionUser]);

  // Determine which profile data to display
  const displayProfile = userProfile || (sessionUser as UserProfile) || {};

  // Helper to get profile values with fallback
  const getProfileValue = (
    profileKey: keyof NonNullable<UserProfile['profile']>,
    fallbackKey?: keyof UserProfile
  ) => {
    if (displayProfile.profile?.[profileKey]) {
      return displayProfile.profile[profileKey];
    }
    if (fallbackKey && displayProfile[fallbackKey]) {
      return displayProfile[fallbackKey];
    }
    return undefined;
  };

  // Extract main profile fields
  const firstName = getProfileValue('firstName', 'firstName') as string;
  const lastName = getProfileValue('lastName', 'lastName') as string;
  const fullName =
    (getProfileValue('fullName', 'fullName') as string) ||
    `${firstName || ''} ${lastName || ''}`.trim();
  const phoneNumber = getProfileValue('phoneNumber', 'phoneNumber') as string;
  const aadharNo = getProfileValue('adhaarNo') as number | undefined;
  const email = displayProfile.email;
  const address = displayProfile.profile?.address || displayProfile.address;
  const ward = displayProfile.ward;

  // Helper to format address for display
  const formatAddress = (address: Address | undefined): string => {
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
    // Paper provides a styled card container for profile info
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
          {personalDetailsLabel}
        </Typography>
        <IconButton>
          <img
            src={edit_square}
            alt="Edit"
            style={{ width: 24, height: 24, color: '#757575' }}
          />
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
        <AccountCircleOutlinedIcon sx={{ fontSize: 54, mr: 2, color: COLORS.text }} />
        <Box>
          <Typography fontWeight={700} fontSize={22} color={COLORS.text}>
            {fullName || 'Name not available'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: COLORS.verified }} />
            {isCitizenProfile ? (
              <Typography fontWeight={600} fontSize={16} color={COLORS.verified}>
                {messages['profile'][lang]['verified-owner']}
              </Typography>
            ) : (
              <Typography fontWeight={600} fontSize={16} color={COLORS.verified}>
                {messages['profile'][lang]['verified-agent']}
              </Typography>
            )}
          </Box>

          {/* Masked phone number for citizen profile */}
          {isCitizenProfile && (
            <Typography fontSize={15} color="#666">
              {aadharNo
                ? `${aadharNo.toString().slice(0, 4)} **** ***${aadharNo
                    .toString()
                    .slice(-1)}`
                : ''}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Contact info and address/jurisdiction section */}
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight={400} fontSize={10} color="hsla(0, 0%, 0%, 0.50)">
          {messages['profile'][lang]['email-address']}:
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
          {personPhone}:
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
              {personAddress}:
            </Typography>
            <Typography fontSize={16} color={COLORS.text}>
              {formatAddress(address)}
            </Typography>
          </>
        )}

        {!isCitizenProfile && (
          <Box>
            <Typography
              fontWeight={400}
              fontSize={10}
              color="hsla(0, 0%, 0%, 0.50)"
              sx={{ mt: 1 }}
            >
              {personJurisdiction}:
            </Typography>
            {(ward || ['Ward Nos. 24 && 38 of BBMP', 'Ward Nos. 46 of BBMP']).map(
              (item: string, index: number) => (
                <Typography
                  key={index}
                  fontWeight={300}
                  fontSize={14}
                  color={COLORS.text}
                >
                  {item}
                </Typography>
              )
            )}
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
              {personProperties}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700} fontSize={22} color={COLORS.text}>
              {noActiveLicenses}
            </Typography>
            <Typography fontSize={14} color="#757575">
              {personLicenses}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontSize={16} color="#757575">
              {personMemberSince}
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

export default ProfileCard;
