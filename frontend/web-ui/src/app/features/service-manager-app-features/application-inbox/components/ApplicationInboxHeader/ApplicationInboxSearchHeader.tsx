
/**
 * This component renders the search and filter header for the application inbox.
 * It includes a title, a search bar, and a filter button for property selection.
 */
import { Box, Typography } from "@mui/material";
import ApplicationInboxFilterButton from "../ApplicationInboxButtons/ApplicationInboxFilterButton";
import ApplicationInboxSearchBar from "../ApplicationInboxSearchBar/ApplicationInboxSearchBar";
import {
  searchHeaderContainerSx,
  selectPropertiesTextSx,
  searchHeaderRowSx,
} from "../../styles/ApplicationInboxHeader/ApplicationInboxSearchHeaderStyle";


// Functional component to render the search and filter header for the inbox
const ApplicationInboxSearchHeader = () => {
  return (
    <Box sx={searchHeaderContainerSx}>
      {/* Title for the property selection section */}
      <Typography sx={selectPropertiesTextSx}>Select Properties</Typography>
      {/* Row containing the search bar and filter button */}
      <Box sx={searchHeaderRowSx}>
        <ApplicationInboxSearchBar />
        <ApplicationInboxFilterButton />
      </Box>
    </Box>
  );
};


// Export the ApplicationInboxSearchHeader component as default
export default ApplicationInboxSearchHeader;