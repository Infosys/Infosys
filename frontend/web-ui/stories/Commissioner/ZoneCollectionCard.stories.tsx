import type { Meta, StoryObj } from '@storybook/react';
import { ZoneCollectionCard, ZoneCollectionDashboard } from '../Components/ZoneCollectionCard';
import type { ZoneData } from '../Components/ZoneCollectionCard';

// Mock data based on the Figma design
const mockZones: ZoneData[] = [
  {
    zoneName: "Model Town Zone",
    ward: "Ward 40-64",
    totalProperties: 765,
    compliance: 65
  },
  {
    zoneName: "Rama Mandi Zone",
    ward: "Ward 75-90",
    totalProperties: 1056,
    compliance: 90
  },
  {
    zoneName: "Urban Estate Zone",
    ward: "Ward 27-45",
    totalProperties: 1615,
    compliance: 75
  },
  {
    zoneName: "Mithapur Zone",
    ward: "Ward 103-95",
    totalProperties: 1258,
    compliance: 78
  },
  {
    zoneName: "Lajpat Nagar Zone",
    ward: "Ward 64-70",
    totalProperties: 736,
    compliance: 58
  },
  {
    zoneName: "Dayal Nagar Zone",
    ward: "Ward 08-18",
    totalProperties: 834,
    compliance: 45
  }
];

// Storybook Meta
const meta: Meta<typeof ZoneCollectionCard> = {
  title: 'Commissioner Dashboard/ZoneCollectionCard',
  component: ZoneCollectionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Zone Collection Card component showing zone information, property counts, and compliance data with color-coded progress bars.'
      }
    }
  },
  argTypes: {
    zone: {
      description: 'Zone data object containing name, ward, properties count, and compliance percentage',
    }
  }
};

export default meta;
type Story = StoryObj<typeof ZoneCollectionCard>;

// Individual Card Stories
export const HighCompliance: Story = {
  args: {
    zone: {
      zoneName: "Rama Mandi Zone",
      ward: "Ward 75-90",
      totalProperties: 1056,
      compliance: 90
    }
  }
};

export const MediumCompliance: Story = {
  args: {
    zone: {
      zoneName: "Urban Estate Zone",
      ward: "Ward 27-45",
      totalProperties: 1615,
      compliance: 75
    }
  }
};

export const LowCompliance: Story = {
  args: {
    zone: {
      zoneName: "Lajpat Nagar Zone",
      ward: "Ward 64-70",
      totalProperties: 736,
      compliance: 58
    }
  }
};

export const CompleteDashboard: StoryObj<typeof ZoneCollectionDashboard> = {
  render: (args: any) => <ZoneCollectionDashboard {...args} />,
  args: {
    zones: mockZones,
    searchTerm: ''
  }
};