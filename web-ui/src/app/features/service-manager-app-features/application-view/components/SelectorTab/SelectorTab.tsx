
import Cards from '../property details/property_cards/cards';
import { Box, Button } from '@mui/material';
import {
  tabBarWrapperStyle,
  tabButtonStyle,
} from "../../Styles/searchPropertyStyles/selectorTabsStyle";
import SearchPropertyDocuments from '../property details/SearchPropertyDocuments';
import SearchPropertyChangeLog from '../change_Log/ChangeLog';


// Supported tab types for the selector
export type TabType = 'property' | 'documents' | 'services' | 'change';


// Props for the SelectorTab component
interface SelectorTabProps {
  activeTab: TabType; // Currently selected tab
  onTabChange: (tab: TabType) => void; // Callback when tab changes
  propertyId: string | null; // Property ID for fetching data
  assesseeId?: string;
}


// Tab configuration: label, value, and disabled state
const tabConfig: {
  label: string;
  value: TabType;
  disabled?: boolean;
}[] = [
  { label: 'Property Details', value: 'property' },
  { label: 'Documents', value: 'documents' },
  { label: 'Services and Utilities', value: 'services', disabled: true },
  { label: 'Change Log', value: 'change' },
];


// SelectorTab component: renders tab buttons and the corresponding content panel
export default function SelectorTab({ activeTab, onTabChange , propertyId, assesseeId}: SelectorTabProps) {
  // Handles tab button clicks, prevents switching to disabled tabs
  function handleTabClick(tab: TabType) {
    if (!tabConfig.find(t => t.value === tab)?.disabled) {
      onTabChange(tab);
    }
  }

  return (
    <Box >
      {/* Tab bar with all configured tabs */}
      <Box
        role="tablist"
        aria-label="Property sections"
        sx={tabBarWrapperStyle}
        className="tabs"
      >
        {tabConfig.map(tab => (
          <Button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            type="button"
            onClick={() => handleTabClick(tab.value)}
            disabled={!!tab.disabled}
            sx={tabButtonStyle(activeTab === tab.value, !!tab.disabled)}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      {/* Content panel: renders the component for the active tab */}
      <Box >
        {activeTab === 'property' && <Cards applicationID={propertyId ?? ""}/>}
        {activeTab === 'documents' && <SearchPropertyDocuments assesseeId={assesseeId ?? ""} propertyId={propertyId ?? ""} />}
        {activeTab === 'services' && ""}
        {activeTab === 'change' && <SearchPropertyChangeLog />}
      </Box>
    </Box>
  );
}