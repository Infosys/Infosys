// filepath: stories/ImportantContacts.stories.tsx
//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import ImportantContacts, { type Contact } from '../src/app/features/Citizen/components/MyCityImpContacts';

const meta: Meta<typeof ImportantContacts> = {
  title: 'MyCity/ImportantContacts',
  component: ImportantContacts,
};

export default meta;
type Story = StoryObj<typeof ImportantContacts>;

const sampleContacts: Contact[] = [
  { label: 'Police Control Room', phone: '80 1234 5678' },
  { label: 'Fire & Emergency', phone: '80 2345 6789' },
  { label: 'Health Dept. Helpline', phone: '3456 7890' },
];

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <ImportantContacts contacts={sampleContacts} />
    </Box>
  ),
};

export const Empty: Story = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <ImportantContacts contacts={[]} />
    </Box>
  ),
};