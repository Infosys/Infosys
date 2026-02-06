// ChromeTabs.tsx displays a tab switcher UI for toggling between Map and List views on the Citizen homepage.
// It uses MUI for UI, localization for tab labels, and styled Button for custom tab appearance.
// Main responsibilities:
// - Render two tabs (Map, List) with dynamic selection
// - Pass selected tab index and change handler via props
// - Use localization for tab labels
// Props:
//   selected (number): index of selected tab
//   onTabChange (function): callback for tab change
//   height, customWidth, selectedColor (optional): style overrides
import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { useAppSelector } from '../../../../redux/Hooks';
import { getMessagesFromSession, useLocalization } from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
// Props for ChromeTabs: selected tab index, change handler, style overrides

interface ChromeTabsProps {
  selected: number;
  onTabChange: (idx: number) => void;
  height?: number;
  customWidth?: string | number;
}
const SELECTED_BG = "#DFDFDF";
const UNSELECTED_BG = "#fff";
const SELECTED_COLOR = "#222";
const UNSELECTED_COLOR = "#222";
const BORDER_COLOR = "#222";
// ChromeTabs component: renders two tabs (Map, List) with selection and localization
const ChromeTabs: React.FC<ChromeTabsProps> = ({
  selected,
  onTabChange,
  height = 56,
  customWidth,
}) => {
  const lang = useAppSelector(state => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession("CITIZEN")!; // Localized messages
  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }
  // Render tab switcher UI
  return (
    <Box
      sx={{
        display: 'flex',
        width: customWidth ?? 'fit-content', // use customWidth, fallback to 'fit-content'
        lineHeight: 0,
        border: `2px solid ${BORDER_COLOR}`,
        borderRadius: selected === 1 ? "18px" : "18px 18px 0 0",
        mb: selected === 0 ? 0 : 1.5,
        background: UNSELECTED_BG,
        transition: 'border-radius 0.2s',
      }}
    >
      <TabButton
        disableRipple
        $isSelected={selected === 0}
        $height={height}
        $selectedTab={selected}
        $borderRadius={selected === 0 ? "18px 0 0 0" : "18px 0 0 18px"}
        onClick={() => onTabChange(0)}
      >
        {messages['citizen.home'][lang]?.['map-btn'] ?? "Map"}
      </TabButton>
      <TabButton
        disableRipple
        $isSelected={selected === 1}
        $height={height}
        $selectedTab={selected}
        $borderRadius={selected === 0 ? "0 18px 0 0" : "0 18px 18px 0"}
        onClick={() => onTabChange(1)}
      >
        {messages['citizen.home'][lang]?.['list-btn'] ?? "List"}
      </TabButton>
    </Box>
  );
};
// TabButton: styled MUI Button for tab appearance and selection
const TabButton = styled(Button, {
  shouldForwardProp: (prop) => (
    prop !== '$isSelected' &&
    prop !== '$height' &&
    prop !== '$selectedTab' &&
    prop !== '$borderRadius'
  )
})<{
  $isSelected: boolean;
  $height: number;
  $selectedTab: number;
  $borderRadius: string;
}>(
  ({ $isSelected, $height, $borderRadius, theme }) => ({
    flex: 1, // Each tab fills half the ChromeTabs container
    height: $height,
    padding: theme.spacing(0, 2),
    fontWeight: 600,
    borderRadius: $borderRadius,
    fontSize: 18,
    textTransform: 'none',
    backgroundColor: $isSelected ? SELECTED_BG : UNSELECTED_BG,
    color: $isSelected ? SELECTED_COLOR : UNSELECTED_COLOR,
    border: 'none',
    borderBottom: $isSelected ? `2px solid ${SELECTED_BG}` : `2px solid transparent`,
    boxShadow: 'none',
    margin: 0,
    letterSpacing: '0.3px',
    '&:hover': {
      backgroundColor: $isSelected ? SELECTED_BG : "#F6F6F6"
    },
    '&:focus-visible': {
      outline: `2px solid ${SELECTED_BG}`,
      outlineOffset: 2
    },
    '&:not(:first-of-type)': {
      marginLeft: 0
    }
  })
);
// Export ChromeTabs for use in Citizen homepage
export default ChromeTabs;