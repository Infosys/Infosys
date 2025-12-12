// This file defines style objects for the Commissioner dashboard layout, including metric card row styles.
// All styles use the MUI SxProps format for easy integration with Material-UI components.
import type { SxProps, Theme } from '@mui/material'

// Style for the row of metric cards (horizontal flex layout with gap)
export const metricCardListSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
}
