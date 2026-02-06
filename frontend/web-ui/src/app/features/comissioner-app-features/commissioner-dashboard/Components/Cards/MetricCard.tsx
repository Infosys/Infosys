// This file contains the MetricCard component, which displays a metric value, title, trend, and target in a styled card.
// Used in the Commissioner dashboard for property tax and registration metrics.
import React from 'react'
import { Box, Typography } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { 
  metricCardContainerStyles, 
  trendIndicatorStyles 
} from '../../Styles/CardsStyles/MetricCardStyle'

// Props for MetricCard:
// - title: metric title
// - value: main value to display
// - target: optional target/goal string
// - trend: optional trend percentage (positive/negative)
// - backgroundColor: card background color (optional)
// - borderColor: card border color (optional)
// - trendColor: color for trend indicator (optional)
interface MetricCardProps {
  title: string
  value: string
  target?: string
  trend?: number
  backgroundColor?: string
  borderColor?: string
  trendColor?: string
}

// MetricCard component displays a metric with title, value, trend, and target
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  target, 
  trend,
  backgroundColor = '#ffffff',
  borderColor = '#ffffff',
  trendColor = '#ffffff'
}) => {
  // Determine if the trend is positive (for icon)
  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <Box sx={metricCardContainerStyles(backgroundColor, borderColor)}>
      {/* Top row: title and trend indicator */}
      <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", gap: 1}}>
        <Typography 
          fontSize={24} 
          fontWeight={700}
          sx={{ 
            maxWidth: '180px',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
        {/* Show trend icon and value if trend is provided */}
        {trend !== undefined && (
          <Box sx={{...trendIndicatorStyles(trendColor), flexShrink: 0}}>
            {isPositiveTrend ? (
              <TrendingUpIcon sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16 }} />
            )}
            <Typography variant="caption" fontWeight={600}>
              {Math.abs(trend)}%
            </Typography>
          </Box>
        )}
      </Box>

      {/* Main value and optional target */}
      <Box>
        <Typography fontSize={24} fontWeight={300} color="#000000">
          {value}
        </Typography>
        {target && (
          <Typography fontSize={14} fontWeight={300} color="#000000">
            {target}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default MetricCard