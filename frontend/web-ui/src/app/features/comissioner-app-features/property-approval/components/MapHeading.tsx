// MapHeading component displays the heading and subtitle for the map view section
// Used in property approval pages to provide context for the map and insights

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Functional component for the map section heading
const MapHeading: React.FC = () => {
  return (
    // Container box for heading and subtitle
    <Box
      sx={{
        pt: 3,
        pl: 3,
        pb: 2,
        position: 'relative',
        backgroundColor: '#ffffffff',
        zIndex: 10,
      }}
    >
      {/* Main heading for the map view */}
      <Typography
        variant="h4"
        sx={{
          fontSize: '32px',
          fontWeight: 500,
          color: '#000000',
          lineHeight: '114%',
          mb: 0.1 ,
        }}
      >
        Map View
      </Typography>
      {/* Subtitle for additional context */}
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: '20px',
          fontWeight: 300,
          color: '#000000ff',
          lineHeight: '114%',
        }}
      >
        Property Tax based Insights
      </Typography>
    </Box>
  )
}

export default MapHeading
