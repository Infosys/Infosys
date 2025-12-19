
/**
 * This component renders the header section for the application inbox page.
 * It displays the main title and a subtitle describing the inbox functionality.
 */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  headerContainerSx,
  headerTitleSx,
  headerSubtitleSx,
} from "../../styles/ApplicationInboxHeader/ApplicationInboxHeaderStyle"


// Functional component to render the inbox header with title and subtitle
const ApplicationInboxHeader = () => {
  return (
    <Box sx={headerContainerSx}>
      <Typography sx={headerTitleSx}>
        Application Inbox
      </Typography>
      <Typography sx={headerSubtitleSx}>
        Manage property applications and workload distribution from inbox
      </Typography>
    </Box>
  )
}


// Export the ApplicationInboxHeader component as default
export default ApplicationInboxHeader