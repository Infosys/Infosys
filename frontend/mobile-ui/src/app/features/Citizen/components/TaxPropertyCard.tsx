import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';

import { useAppSelector } from '../../../../redux/Hooks';
import { getMessagesFromSession } from '../../../../services/Citizen/Localization/LocalizationContext';
import Stack from '@mui/material/Stack';
import activity_zone from '../../../assets/activity_zone.svg';
import { HouseOutlined } from '@mui/icons-material';
import React from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { useNavigate } from 'react-router-dom';
import { useGetTaxCalculatorQuery } from '../../Citizen/api/taxCalculatorApi';

interface TaxPropertyCardProps {
  property: any;
  propertyId?: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  Registered: { bg: '#85B9A1', color: '#fff' },
  'Under Enumeration': { bg: '#FFCDB6', color: '#000' },
  Draft: { bg: '#FFC107', color: '#000' },
};

const TaxPropertyCard: React.FC<TaxPropertyCardProps> = ({ property }) => {
  const type = property.propertyType;
  const navigate = useNavigate();

  const lang = useAppSelector((state) => state.lang.citizenLang);
  const messages = getMessagesFromSession('CITIZEN')!;

  const builtUpArea = property.IGRS.builtUpAreaPct
    ? `${property.IGRS.builtUpAreaPct} sq ft`
    : '-';
  const plotArea = property.IGRS?.totalPlinthArea
    ? `${property.IGRS.totalPlinthArea} sq ft`
    : '-';
  const zone = property.Address?.ZoneNo || '-';

  const address = property.propertyAddress
    ? [
        property.propertyAddress.street,
        property.propertyAddress.locality,
        property.propertyAddress.wardNo,
        property.propertyAddress.zoneNo,
        property.propertyAddress.blockNo,
        property.propertyAddress.pincode,
      ]
        .filter(Boolean)
        .join(', ')
    : property.locationData?.address || '';

  const propertyNo = property.PropertyNo || '';

  const { data, isLoading, isError, error } = useGetTaxCalculatorQuery(
    { propertyNo: propertyNo },
    { skip: !propertyNo }
  );

  const totalAmount = data?.Calculations?.[0]?.totalAmount ?? 0;

  let status = 'Under Enumeration';
  if (property.enumerationProgress === -1) {
    status = 'Draft';
  } else if (property.enumerationProgress === 100) {
    status = 'Registered';
  }

  const badge = statusColors[status] || statusColors['Under Enumeration'];

  // Show loading state
  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 2,
          bgcolor: '#fff',
          width: '380px',
          border: '1.5px solid #8b8585ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <Typography>Loading tax calculation...</Typography>
      </Paper>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 2,
          bgcolor: '#fff',
          width: '380px',
          border: '1.5px solid #ff0000',
        }}
      >
        <Typography color="error">Error loading tax data</Typography>
        <Typography fontSize={12} color="text.secondary">
          {(error as any)?.data?.message || 'Failed to fetch tax calculation'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: '#fff',
        width: '380px',
        border: status === 'Registered' ? `1.5px solid #000003` : `1.5px solid #8b8585ff`,
        cursor: 'pointer',
      }}
    >
      {/* Header: Property type and status badge */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 1,
          width: '100%',
        }}
      >
        <Chip
          label={status}
          sx={{
            bgcolor: badge.bg,
            color: badge.color,
            fontWeight: 400,
            fontSize: 12,
            borderRadius: 2,
            px: 0.5,
            height: 20,
            ml: 1,
            boxShadow: 'none',
          }}
        />
      </Box>
      {/* Address label */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          padding: 2,
        }}
      >
        <RadioButtonCheckedOutlinedIcon
          sx={{
            color: status === 'Registered' ? '#C84C0E' : '#696d6bff',
            fontSize: 24,
            mr: 1,
          }}
        />
        {/* Address value */}
        <Box>
          <Typography
            sx={{
              fontWeight: 400,
              color: '#1A1816',
              fontSize: 16,
              fontStyle: 'semibold',
              mb: 0.5,
              lineHeight: 1.5,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {address || 'Address not available'}
          </Typography>
          {status !== 'Registered' && (
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 300,
                fontSize: 14,
                letterSpacing: '0.01em',
                backgroundColor: '#C84C0E',
                width: 'fit-content',
                padding: '2px 12px',
                borderRadius: 8,
                marginTop: '8px',
              }}
            >
              {type}
            </Typography>
          )}
        </Box>
      </Box>
      {status === 'Registered' && (
        <>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              padding: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {/* Built-up Area */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{ minWidth: 0, flex: 1, mb: 2 }}
              >
                <HouseOutlined sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }} />{' '}
                <Box>
                  <Typography fontSize={13} color="#888">
                    {messages['citizen.my-properties'][lang]['built-up-area']}
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="#222"
                    fontSize={16}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {builtUpArea}
                  </Typography>
                </Box>
              </Stack>
              {/* Plot Area */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{ minWidth: 0, flex: 1 }}
              >
                <img src={activity_zone} alt="Activity Zone" height="18" width="18" />
                <Box>
                  <Typography fontSize={13} color="#888">
                    {messages['citizen.my-properties'][lang]['plot-area']}
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="#222"
                    fontSize={16}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {plotArea}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {/* Property Age */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{ minWidth: 0, flex: 1 }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }}
                />
                <Box>
                  <Typography fontSize={13} color="#888">
                    Property Age
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="#222"
                    fontSize={16}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {builtUpArea}
                  </Typography>
                </Box>
              </Stack>
              {/* Zone */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{ minWidth: 0, flex: 1 }}
              >
                <FmdGoodOutlinedIcon sx={{ color: '#9E9E9E', fontSize: 22, mt: 0.5 }} />
                <Box>
                  <Typography fontSize={13} color="#888">
                    Zone
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="#222"
                    fontSize={16}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {zone}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#FBEEE8',
              px: 4,
              py: 1,
              borderRadius: 4,
              mt: 2,
            }}
          >
            <Typography fontWeight={400} fontSize={16} color="#222" sx={{ mt: 1 }}>
              Annual Rental Value (ARV)
            </Typography>
            <Typography color="#222" fontSize={12} sx={{ lineHeight: 1.2 }}>
              Built-up Area * Unit Area Value
            </Typography>
            <br />
            <Typography fontWeight={700} fontSize={20} color="#C84C0E" sx={{ mb: 1 }}>
              ₹ {totalAmount || '0'}
            </Typography>
            <Typography
              fontWeight={300}
              fontSize={14}
              color="#C84C0E"
              sx={{ textDecoration: 'underline', mb: 1, mt: -1, cursor: 'pointer' }}
              onClick={() => navigate(`/under-construction`)}
            >
              View Breakdown
            </Typography>
          </Box>
          <Box
            paddingTop={3}
            paddingBottom={4}
            width="100%"
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() => navigate(`/under-construction`)}
              variant="contained"
              sx={{
                bgcolor: '#c84c0e',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                width: '65%',
              }}
            >
              Download Sample Bill
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TaxPropertyCard;
