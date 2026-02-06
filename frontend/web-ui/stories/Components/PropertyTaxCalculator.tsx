import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

export interface PropertyTaxCalculatorCard {
  id: string;
  propertyName: string;
  applicationId: string;
  potentialDues: number;
  currency?: string;
  onCalculatorClick?: (id: string) => void;
}

export interface PropertyTaxCalculatorProps {
  property: PropertyTaxCalculatorCard;
}

export const PropertyTaxCalculator: React.FC<PropertyTaxCalculatorProps> = ({ property }) => {
  const formatCurrency = (amount: number, currency: string = '₹') => {
    return `${currency} ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card
      sx={{
        width: 280,
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        fontFamily: 'Roboto'
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              fontSize: '18px',
              mb: 0,
              lineHeight: 1.3,
              fontFamily: 'Roboto'
            }}
          >
            {property.propertyName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#000000',
              fontSize: '14px',
              fontWeight: 500,
              mt: 0,
              fontFamily: 'Roboto'
            }}
          >
            {property.applicationId}
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#e0f2fe',
            p: 2.5,
            pt: 2.5,
            pb: 2.5,
            mx: 2,
            borderRadius: '10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#000000',
              fontSize: '14px',
              fontWeight: 500,
              mb: 1,
              fontFamily: 'Roboto'
            }}
          >
            Potential Dues:
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#000000',
              fontWeight: 700,
              fontSize: '24px',
              mb: 2,
              fontFamily: 'Roboto'
            }}
          >
            {formatCurrency(property.potentialDues, property.currency)}
          </Typography>

          <Button
            variant="contained"
            startIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
            onClick={() => property.onCalculatorClick?.(property.id)}
            sx={{
              backgroundColor: '#0B4B66',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#093a50',
                boxShadow: '0 2px 4px rgba(11,75,102,0.2)',
              },
              '& .MuiButton-startIcon': {
                marginRight: '8px'
              },
              fontFamily: 'Roboto',
              minWidth: 180,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <Box component="span" sx={{ fontSize: '13px', display: 'block' }}>Property tax</Box>
              <Box component="span" sx={{ fontSize: '13px', display: 'block' }}>calculator</Box>
            </Box>
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export interface PropertyTaxCalculatorListProps {
  properties?: PropertyTaxCalculatorCard[];
  title?: string;
  onCalculatorClick?: (id: string) => void;
}

export const PropertyTaxCalculatorList: React.FC<PropertyTaxCalculatorListProps> = ({
  properties = [],
  title = "Property Tax Calculator",
  onCalculatorClick
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, fontFamily: 'Roboto' }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: '#1f2937',
          fontFamily: 'Roboto'
        }}
      >
        {title}
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'flex-start'
      }}>
        {properties.map((property) => (
          <PropertyTaxCalculator
            key={property.id}
            property={{
              ...property,
              onCalculatorClick: onCalculatorClick
            }}
          />
        ))}

        {properties.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography
              sx={{
                color: '#6b7280',
                fontSize: '16px',
                fontFamily: 'Roboto'
              }}
            >
              No properties available for tax calculation
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};