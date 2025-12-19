
/**
 * This component renders the main application inbox page for the service manager.
 * It includes the jurisdiction dropdown, header, search/filter controls, and the list of property cards.
 */
import Box from '@mui/material/Box'
import ApplicationInboxHeader from './ApplicationInboxHeader/ApplicationInboxHeader'
import ApplicationInboxSearchHeader from './ApplicationInboxHeader/ApplicationInboxSearchHeader'
import {
  mainContainerSx,
  contentRowSx,
  leftColumnSx,
} from '../styles/ApplicationInboxStyle'
import ApplicationInboxPropertyCardList from './ApplicationInboxPropertyCard/ApplicationInboxPropertyCardList'
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown'
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle'


// Props for the ApplicationInbox component
interface ApplicationInboxProps {
  sideBarOpen?: boolean; // (Optional) Whether the sidebar is open
  setSelectedNav?: (nav: string) => void; // (Optional) Handler to set selected navigation
}


// Functional component to render the main application inbox page
const ApplicationInbox: React.FC<ApplicationInboxProps> = () => {
  return (
    <Box sx={{ ...mainContainerSx, m:0, pt:3 }}>
      {/* Jurisdiction dropdown for filtering by zone/ward */}
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F0DED1" />
      </Box>
      {/* Header for the inbox page */}
      <ApplicationInboxHeader />
      <Box sx={contentRowSx}>
        <Box sx={leftColumnSx}>
          {/* Search and filter controls */}
          <ApplicationInboxSearchHeader />
          {/* List of property cards */}
          <ApplicationInboxPropertyCardList />
        </Box>
      </Box>
    </Box>
  )
}


// Export the ApplicationInbox component as default
export default ApplicationInbox