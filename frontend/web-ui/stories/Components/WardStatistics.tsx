import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Divider
} from '@mui/material';

// Ward Statistics interface
export interface WardStatistics {
  wardNumber: number;
  zoneName: string;
  zoneCode: string;
  zoneLocation: string;
  pending: number;
  approved: number;
  rejected: number;
  avgTime: string;
}

export interface WardStatisticsCardProps {
  ward: WardStatistics;
}

export const WardStatisticsCard: React.FC<WardStatisticsCardProps> = ({ ward }) => {
  return (
    <Card 
      sx={{ 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        mb: 2,
        backgroundColor: '#ffffff'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Top row: header (left) and stats (right) */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: '#1f2937',
                fontFamily: 'Roboto',
                fontSize: '16px',
                mb: 0.5
              }}
            >
              Ward {ward.wardNumber} - {ward.zoneName}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#000000',        
                fontSize: '14px',
                fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
            
              }}
            >
              {ward.zoneCode} {ward.zoneLocation}
            </Typography>
          </Box>

          {/* Right-aligned statistics */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {/* Pending */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#dc2626',
                  fontWeight: 700,
                  fontFamily: 'Roboto',
                  fontSize: '20px',
                  mb: 0.5
                }}
              >
                {ward.pending}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'Roboto',
                  display: 'block'
                }}
              >
                Pending
              </Typography>
            </Box>

            {/* Approved */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '20px',
                  fontFamily: 'Roboto',
                  mb: 0.5
                }}
              >
                {ward.approved}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#16a34a',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'Roboto',
                  display: 'block'
                }}
              >
                Approved
              </Typography>
            </Box>

            {/* Rejected */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ea580c',
                  fontWeight: 700,
                  fontFamily: 'Roboto',
                  fontSize: '20px',
                  mb: 0.5
                }}
              >
                {ward.rejected}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#ea580c',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'Roboto',
                  display: 'block'
                }}
              >
                Rejected
              </Typography>
            </Box>

            {/* Average Time */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1f2937',
                  fontWeight: 700,
                  fontFamily: 'Roboto',
                  fontSize: '18px',
                  mb: 0.5
                }}
              >
                {ward.avgTime}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6b7280',
                  fontSize: '12px',
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  display: 'block'
                }}
              >
                Avg. Time
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Orange divider line below header + stats */}
        <Divider 
          sx={{ 
            backgroundColor: '#f97316',
            height: '3px',
            mb: 0,
            borderRadius: '1px'
          }} 
        />

        {/* keep any additional content below divider if needed */}
      </CardContent>
    </Card>
  );
};

export interface WardStatisticsListProps {
  wards?: WardStatistics[];
  title?: string;
}

export const WardStatisticsDashboard: React.FC<WardStatisticsListProps> = ({ 
  wards = [],
  title = "Ward Statistics"
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          fontFamily: 'Roboto',
          color: '#1f2937'
        }}
      >
        {title}
      </Typography>
      
      <Box>
        {wards.map((ward) => (
          <WardStatisticsCard 
            key={`${ward.wardNumber}-${ward.zoneCode}`} 
            ward={ward}
          />
        ))}
        
        {wards.length === 0 && (
          <Typography 
            sx={{ 
              textAlign: 'center', 
              color: '#6b7280',
              py: 8,
              fontFamily: 'Roboto',
              fontSize: '14px'
            }}
          >
            No ward statistics available
          </Typography>
        )}
      </Box>
    </Container>
  );
};