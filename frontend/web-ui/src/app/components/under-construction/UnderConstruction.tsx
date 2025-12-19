import { type FC } from 'react';
import { Box, Typography } from '@mui/material';
import tenorGif from './assets/tenor.gif';

/**
 * UnderConstruction component
 * Renders an under construction message with animation for unfinished routes.
 */
const UnderConstruction: FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      {/* Main content container */}
      <Box
        sx={{
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(163, 199, 215, 0.15)',
          background: '#ffffff',
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 8 },
          border: '1px solid #A3C7D733',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        {/* Animated Circle with Builder GIF */}
        <Box
          sx={{
            mb: 4,
            animation: 'floatY 2s ease-in-out infinite',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#ffffff',
            border: '5px solid #A3C7D7',
            boxShadow: '0 4px 20px rgba(163, 199, 215, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={tenorGif}
            alt="Under construction"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Main under construction heading */}
        <Typography
          variant="h3"
          fontWeight={700}
          color="#A3C7D7"
          gutterBottom
          sx={{
            fontFamily: 'Roboto, sans-serif',
            mb: 2,
          }}
        >
          Under Construction
        </Typography>

        {/* Subtext with additional info */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 1,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
          }}
        >
          We're building something awesome!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            opacity: 0.8,
          }}
        >
          This page is currently under development. Please check back soon.
        </Typography>
      </Box>

      {/* Float animation */}
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default UnderConstruction;