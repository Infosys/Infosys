// This file defines style objects and functions for the MetricCard component and related metric UI elements.
// All styles use the MUI SxProps format for easy integration with Material-UI components.
import type { SxProps, Theme } from '@mui/material'

// Style for the outer container of a metric card
export const metricCardContainerStyles = (
  backgroundColor: string,
  borderColor: string
): SxProps<Theme> => ({
  backgroundColor,
  border: `1.5px solid ${borderColor}`,
  borderRadius: '10px',
  p:1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth:'250px'
})

// Style for the header row of a metric card (title and trend)
export const metricHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 0.5,
}

// Style for the main metric value text
export const metricValueStyles: SxProps<Theme> = {
  fontSize: '32px',
  fontWeight: 600,
  color: '#0F172A',
  lineHeight: 1.2,
}

// Style for the target/goal text below the metric value
export const metricTargetStyles: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 400,
  color: '#64748B',
  mt: 0.5,
}

// Style for the trend indicator (icon and percentage)
export const trendIndicatorStyles = (trendColor: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  color: trendColor,
})