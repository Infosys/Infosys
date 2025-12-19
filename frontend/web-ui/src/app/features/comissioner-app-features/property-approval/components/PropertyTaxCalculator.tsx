
// PropertyTaxCalculator displays property info and a button to launch the tax calculator
import { Box, Typography, Button } from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';


// Props for PropertyTaxCalculator component
interface PropertyTaxCalculatorProps {
  propertyId?: string; // Unique property ID
  propertyName?: string; // Name of the property
  potentialDues?: number; // Potential tax dues (in INR)
}


export default function PropertyTaxCalculator({
  propertyName = "Gandhi Nagar Complex",
  propertyId = "BLR-2024-001",
  potentialDues = 10000.00
}: PropertyTaxCalculatorProps) {
  // Handler for calculator button click (could navigate to calculator page)
  const handleCalculatorClick = () => {
    // Handle navigation to tax calculator (currently just logs to console)
    console.log('Opening tax calculator for property:', propertyId);
  };

  return (
    <Box
      sx={{
        width: '290px', // Fixed width for the card
        bgcolor: '#fff', // White background
        borderRadius: '12px', // Rounded corners
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Subtle shadow
        padding: '16px',
        height: 340
      }}
    >
      {/* Header section with property name and ID */}
      <Box>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 500,
            color: '#0f172a',
            lineHeight: 1.3
          }}
        >
          {propertyName}
        </Typography>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 100
          }}
        >
          {propertyId}
        </Typography>
      </Box>

      {/* Blue box section showing potential dues and calculator button */}
      <Box
        sx={{
          bgcolor: '#C8E0E9', // Light blue background
          padding: '16px 10px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2
        }}
      >
        {/* Display the potential dues for the property */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 400,
            }}
          >
            Potential Dues:
          </Typography>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 1
            }}
          >
            {/* Rupee symbol and formatted dues */}
            <span style={{ fontSize: '15px' }}>₹</span>
            {potentialDues.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Typography>
        </Box>

        {/* Button to open the property tax calculator */}
        <Button
          variant="contained"
          startIcon={<LaunchIcon sx={{ fontSize: '16px !important' }} />}
          onClick={handleCalculatorClick}
          sx={{
            bgcolor: '#0b5a7a',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '0 10px',
            alignSelf: 'center',
            width: '70%',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#094a63',
              boxShadow: '0 2px 8px rgba(11, 90, 122, 0.3)'
            }
          }}
        >
          Property tax calculator
        </Button>
      </Box>

    </Box>
  );
}
