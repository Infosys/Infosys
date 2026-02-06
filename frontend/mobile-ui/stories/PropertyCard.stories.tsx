//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type PropertyCard from '../src/app/features/Citizen/components/PropertyCard';
// Note: stories avoid using Redux. We render presentational versions to keep stories sandboxed.

// Sample property used by stories
// const sampleProperty = {
//   id: 'prop-001',
//   propertyType: 'Residential',
//   enumerationProgress: 50,
//   propertyAddress: {
//     street: 'Plot 567, 27th Main Road',
//     locality: 'HSR Layout',
//     wardNo: 'Sector 1',
//     zoneNo: 'Zone 3',
//     blockNo: 'Block A',
//     pincode: '560102',
//   },
//   GISData: { Latitude: 12.9352, Longitude: 77.6245 },
//   __appId: 'app-123',
// };

// Draft property example
//const draftProperty = { ...sampleProperty, id: 'prop-002', enumerationProgress: -1, propertyType: 'Primary' };

// Seed localization messages used by PropertyCard
const seedMessages = () => {
  const key = 'localization_CITIZEN';
  if (!sessionStorage.getItem(key)) {
    const messages = {
      'citizen.my-properties': {
        en: { address: 'Address' }
      },
      'citizen.commons': {
        en: { 'view-location': 'View Location' }
      }
    };
    sessionStorage.setItem(key, JSON.stringify(messages));
  }
};

const meta: Meta = {
  title: 'Citizen/Cards/PropertyCard',
};

export default meta;
type Story = StoryObj<typeof PropertyCard>;

export const NoRedux: Story = {
  render: () => {
    seedMessages();
    return (
      <Box sx={{ p: 4 }}>
        {/* Presentational card (no Redux, no map) */}
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: '#fff', boxShadow: '0 1px 6px #0002', width: 380 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography sx={{ color: '#C84C0E', fontWeight: 300, fontSize: 16 }}>Residential Property</Typography>
            <Box sx={{ bgcolor: '#FFCDB6', color: '#000', fontWeight: 400, fontSize: 12, borderRadius: 1, px: 0.5, height: 20, display: 'flex', alignItems: 'center' }}>Under Enumeration</Box>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#888', mb: 0.5 }}>Address</Typography>
          <Typography sx={{ fontWeight: 600, color: '#1A1816', fontSize: 16, mb: 0.5 }}>Plot 567, 27th Main Road, HSR Layout, Sector 1, Bengaluru - 560102</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, gap: 1 }}>
            <Button variant="outlined" sx={{ borderRadius: 8, fontWeight: 400, fontSize: 13, color: '#1A1816' }}>View Location</Button>
          </Box>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 120, border: '1.5px solid #F3E0D1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#999' }}>Map preview placeholder</Typography>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: '#fff', boxShadow: '0 1px 6px #0002', width: 380 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography sx={{ color: '#D49C7A', fontWeight: 300, fontSize: 16 }}>Primary Property</Typography>
            <Box sx={{ bgcolor: '#FFF2E8', color: '#C84C0E', fontWeight: 400, fontSize: 12, borderRadius: 1, px: 0.5, height: 20, display: 'flex', alignItems: 'center' }}>Draft</Box>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#888', mb: 0.5 }}>Address</Typography>
          <Typography sx={{ fontWeight: 600, color: '#1A1816', fontSize: 16, mb: 0.5 }}>Address not available</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, gap: 1 }}>
            <Button variant="contained" sx={{ borderRadius: 8, fontWeight: 500, fontSize: 13, color: '#fff', bgcolor: '#C84C0E' }}>Complete Form</Button>
          </Box>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 120, border: '1.5px solid #F3E0D1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#999' }}>Map preview placeholder</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
};

// Mocked visual version without map or navigation dependencies
export const Mocked: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Paper elevation={0} sx={{ borderRadius: 3, p: 2.5, mb: 2, bgcolor: '#fff', boxShadow: '0 1px 6px #0002', width: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography sx={{ color: '#C84C0E', fontWeight: 300, fontSize: 16 }}>Residential Property</Typography>
          <Box sx={{ bgcolor: '#FFCDB6', color: '#000', fontWeight: 400, fontSize: 12, borderRadius: 1, px: 0.5, height: 20, display: 'flex', alignItems: 'center' }}>Under Enumeration</Box>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#888', mb: 0.5 }}>Address</Typography>
        <Typography sx={{ fontWeight: 600, color: '#1A1816', fontSize: 16, mb: 0.5 }}>Plot 567, 27th Main Road, HSR Layout, Sector 1, Bengaluru - 560102</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, gap: 1 }}>
          <Button variant="outlined" sx={{ borderRadius: 8, fontWeight: 400, fontSize: 13, color: '#1A1816' }}>View Location</Button>
        </Box>
        <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 120, border: '1.5px solid #F3E0D1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#999' }}>Map preview placeholder</Typography>
        </Box>
      </Paper>
    </Box>
  ),
};
