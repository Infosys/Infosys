// This file contains the SelectorTab component, which renders a row of selectable tabs for switching dashboard views.
// It is used in the Commissioner dashboard to switch between different data views.
import React from 'react'
import { Box } from '@mui/material'
import { tabContainerStyles, tabButtonStyles } from '../Styles/SelectorTabStyles'

// Represents a single tab option
interface Tab {
  id: string // Unique tab identifier
  label: string // Display label for the tab
}

// Props for SelectorTab:
// - tabs: array of tab options
// - activeTab: currently selected tab id
// - onTabChange: callback when a tab is selected
interface SelectorTabProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

// SelectorTab component renders a row of clickable tabs
const SelectorTab: React.FC<SelectorTabProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Box sx={{ ...tabContainerStyles, mb: 1 }}>
      {/* Render each tab as a clickable box */}
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => onTabChange(tab.id)} // Change active tab on click
          sx={tabButtonStyles(activeTab === tab.id)} // Style based on active state
        >
          {tab.label}
        </Box>
      ))}
    </Box>
  )
}

export default SelectorTab