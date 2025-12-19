import React from 'react';
import { Box, styled, keyframes, Typography } from '@mui/material';

// Keyframes for the wave animation
const wave = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

// Styled component for each dot
const Dot = styled(Box)(({ theme }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: `${wave} 1.2s ease-in-out infinite`,
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
}));

// Container for the dots
const LoaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',
  height: '100vh',
  backgroundColor: '#f5f5f5',
});

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message = 'Loading...' }) => {
  return (
    <LoaderContainer>
      <Box sx={{ display: 'flex', gap: '12px' }}>
        <Dot />
        <Dot />
        <Dot />
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.secondary',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </LoaderContainer>
  );
};

export default LoadingPage;