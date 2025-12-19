// ChromeTabs.tsx
// Renders a styled tab switcher for agent pages, mimicking Chrome tab appearance.
// Supports two tabs: map and land use, with localization.
import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { useHomePageLocalization } from '../../services/AgentLocalisation/localisation-homepage';
 
// Props for ChromeTabs component
interface ChromeTabsProps {
  selected: number;
  onTabChange: (idx: number) => void;
  height?: number;
}
 
/**
 * ChromeTabs component
 * Renders two styled tabs (map and land use) with localization, highlights selected tab, and calls onTabChange on click.
 */
const ChromeTabs: React.FC<ChromeTabsProps> = ({
  selected,
  onTabChange,
  height = 50
}) => {
  // Get localized tab labels
  const { mapTabText, landuseTabText } = useHomePageLocalization();
 
  return (
    <TabsContainer>
      {/* Map tab */}
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
      {/* Land use tab */}
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
 
// Container for the tab buttons
const TabsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyItems:'center',
  width: '338px',
  border: '1px solid #000',
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14  ,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: 'hidden',
  background: '#fff',
  paddingBottom:'0.5px'
});
 
// Styled tab button with selected state and custom height
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
  fontSize: 15, // <-- Set font size to 14px
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
 
// Export ChromeTabs as default
export default ChromeTabs;
 