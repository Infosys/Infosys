import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Container,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search } from '@mui/icons-material';

// Mock Zone Collection Card Component based on Figma design
interface ZoneData {
  zoneName: string;
  ward: string;
  totalProperties: number;
  compliance: number; // percentage
}

interface ZoneCollectionCardProps {
  zone: ZoneData;
}

const ZoneCollectionCard: React.FC<ZoneCollectionCardProps> = ({ zone }) => {
  // Determine card color based on compliance percentage
  const getCardColor = (compliance: number) => {
    if (compliance >= 80) return '#E8F5E8';
    if (compliance >= 60) return '#FFF3E0';
    return '#FFEBEE';
  };

  const getProgressColor = (compliance: number) => {
    if (compliance >= 80) return '#4CAF50';
    if (compliance >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <Card
      sx={{
        backgroundColor: getCardColor(zone.compliance),
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        mb: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: '#2C3E50'
          }}
        >
          {zone.zoneName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#7F8C8D',
            mb: 2
          }}
        >
          {zone.ward}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Total Properties:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
              {zone.totalProperties}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontStyle: 'italic',
                color: '#5D6D7E'
              }}
            >
              Compliance
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: getProgressColor(zone.compliance)
              }}
            >
              {zone.compliance}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={zone.compliance}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#E0E0E0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(zone.compliance),
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Zone Collection Dashboard Component
interface ZoneCollectionDashboardProps {
  zones?: ZoneData[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const ZoneCollectionDashboard: React.FC<ZoneCollectionDashboardProps> = ({
  zones = [],
  searchTerm = '',
  onSearchChange
}) => {
  const filteredZones = zones.filter(zone =>
    zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: '#2C3E50'
        }}
      >
        Zone Collection Information
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search Zones"
        value={searchTerm}
        onChange={(e) => onSearchChange?.(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px',
            backgroundColor: '#F8F9FA'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start">
                <Search sx={{ color: '#7F8C8D' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Zone Cards */}
      <Box>
        {filteredZones.map((zone, index) => (
          <ZoneCollectionCard key={index} zone={zone} />
        ))}

        {filteredZones.length === 0 && searchTerm && (
          <Typography
            sx={{
              textAlign: 'center',
              color: '#7F8C8D',
              py: 4
            }}
          >
            No zones found matching "{searchTerm}"
          </Typography>
        )}
      </Box>
    </Container>
  );
};

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
  render: (args) => <ZoneCollectionDashboard {...args} />,
  args: {
    zones: mockZones,
    searchTerm: ''
  }
};
