import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import PropertyTransferCard, { type PropertyTransferData } from '../src/app/features/Citizen/components/MyCityPropertyTransfer';

const meta: Meta<typeof PropertyTransferCard> = {
  title: 'MyCity/PropertyTransferCard',
  component: PropertyTransferCard,
};

export default meta;
type Story = StoryObj<typeof PropertyTransferCard>;

const sampleData: PropertyTransferData = {
  title: 'Property Transfer',
  department: 'BBMP Revenue Department',
  processingTime: '30-45 working days',
  officeLocation: 'Revenue Office, HSR Layout',
  contact: '080-22970000',
  requiredDocuments: true,
  applyLink: '#apply-property-transfer'
};

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <PropertyTransferCard 
        data={sampleData}
        onApply={() => alert('Apply Now clicked!')}
      />
    </Box>
  ),
};


export const Multiple: Story = {
  render: () => (
    <Box sx={{ p: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <PropertyTransferCard data={sampleData} onApply={() => {}} />
      <PropertyTransferCard 
        data={{
          ...sampleData,
          title: 'Property Registration',
          department: 'Sub-Registrar Office',
          processingTime: '15-20 working days',
          requiredDocuments: false
        }}
        onApply={() => {}}
      />
    </Box>
  ),
};