
// ChromeTabs renders a tab switcher styled like Chrome browser tabs for Agent screens.
// Displays two tabs (Map and Landuse) with localized labels.
// Highlights the selected tab and notifies parent on tab change.
// Uses MUI styled components for custom appearance.

import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { useHomePageLocalization } from '../../../../services/AgentLocalisation/localisation-homepage';
 

// Props for ChromeTabs:
//   - selected: index of currently selected tab (0 or 1)
//   - onTabChange: callback for tab change
//   - height: optional tab height (default 50)
interface ChromeTabsProps {
  selected: number;
  onTabChange: (idx: number) => void;
  height?: number;
}
 

const ChromeTabs: React.FC<ChromeTabsProps> = ({
  selected,
  onTabChange,
  height = 50
}) => {
  // Get localized tab labels
  const { mapTabText, landuseTabText } = useHomePageLocalization();

  // Render two styled tab buttons for Map and Landuse
  return (
    <TabsContainer>
      <TabButton
        $isSelected={selected === 0}
        $height={height}
        onClick={() => onTabChange(0)}
        style={{
          borderTopLeftRadius: 18,
          borderTopRightRadius: 0,
        }}
      >
        {mapTabText}
      </TabButton>
      <TabButton
        $isSelected={selected === 1}
        $height={height}
        onClick={() => onTabChange(1)}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 18,
        }}
      >
        {landuseTabText}
      </TabButton>
    </TabsContainer>
  );
};
 

// Container for tab buttons, styled for Chrome-like appearance
const TabsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyItems:'center',
  width: '338px',
  border: '1px solid #000',
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: 'hidden',
  background: '#fff',
  paddingBottom:'0.5px'
});
 

// Styled tab button for ChromeTabs, highlights when selected
const TabButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$isSelected' && prop !== '$height'
})<{
  $isSelected: boolean;
  $height: number;
}>(({ $isSelected, $height }) => ({
  flex: 1,
  minWidth: 0,
  height: $height,
  fontWeight: $isSelected ? 400 : 300,
  fontSize: 15,
  background: $isSelected ? '#ededed' : '#fff',
  color: '#000',
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  textTransform: 'none',
  transition: 'background 0.2s',
  '&:hover': {
    background: $isSelected ? '#ededed' : '#f5f5f5',
  },
  // Remove focus ring
  '&:focus-visible': {
    outline: 'none',
  },
}));
 

// Export ChromeTabs for use in Agent screens
export default ChromeTabs;
 