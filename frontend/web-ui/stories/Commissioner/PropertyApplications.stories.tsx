import type { Meta, StoryObj } from '@storybook/react';
import { PropertyApplicationCard, PropertyApplicationsList } from '../Components/PropertyApplication';
import type { PropertyApplication } from '../Components/PropertyApplication';

const mockApplications: PropertyApplication[] = [
  { id: '1', title: 'Gandhi Nagar Complex', applicationId: 'PRP-2024-045', location: 'MG Road • Ward 108 • Zone 3 - Central', date: '14 Sept 2025', time: '10:30', tags: [{ label: 'Commercial', variant: 'outlined' }, { label: 'Enumeration', variant: 'outlined' }], hasInfo: true },
  { id: '2', title: 'Brodipet Commercial', applicationId: 'PRP-2024-044', location: 'Indiranagar • Ward 85 • Zone 5 - East', date: '20 Sept 2025', time: '09:15', tags: [{ label: 'Commercial', variant: 'outlined' }, { label: 'Enumeration', variant: 'outlined' }], hasInfo: true }
];

const meta: Meta<typeof PropertyApplicationCard> = {
  title: 'Commissioner Dashboard/PropertyApplications',
  component: PropertyApplicationCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onViewApplication: {
      action: 'view application clicked',
    }
  }
};

export default meta;
type Story = StoryObj<typeof PropertyApplicationCard>;

export const DefaultCard: Story = { 
  args: { 
    application: mockApplications[0] 
  } 
};

export const ApplicationsListStory: StoryObj<typeof PropertyApplicationsList> = { 
  render: () => <PropertyApplicationsList applications={mockApplications} /> 
};