//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import LicenseCertificate from '../src/app/features/Citizen/components/LicenseCertificate';

const meta: Meta<typeof LicenseCertificate> = {
  title: 'Licenses/LicenseCertificate',
  component: LicenseCertificate,
};

export default meta;
type Story = StoryObj<typeof LicenseCertificate>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <LicenseCertificate
        qrSrc={undefined}
        onView={() => alert('View Details')}
        onDownload={() => alert('Download')}
      />
    </Box>
  ),
};