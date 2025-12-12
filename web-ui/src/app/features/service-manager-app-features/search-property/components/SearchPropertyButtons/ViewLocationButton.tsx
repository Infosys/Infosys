// This file defines the ViewLocationButton component, which displays a styled button
// with an icon and the label "View Location". It is typically used to trigger a location view action.

import React from "react";
import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { viewLocationButtonSx, viewLocationIconSx } from "../../styles/SearchPropertyButtons/ViewLocationButtonStyle";


// Props for the ViewLocationButton component
// onClick: Optional callback function to handle button click events
interface ViewLocationButtonProps {
  onClick?: () => void;
}


/**
 * ViewLocationButton Component
 * 
 * Renders a styled button with an "open in new" icon and the label "View Location".
 * When clicked, it triggers the optional onClick callback provided via props.
 * Styling is applied using custom style objects for both the button and the icon.
 */
const ViewLocationButton: React.FC<ViewLocationButtonProps> = ({ onClick }) => (
  <Button
    variant="outlined" // Outlined style for the button
    startIcon={<OpenInNewIcon sx={viewLocationIconSx} />} // Icon at the start of the button
    onClick={onClick} // Click handler passed from parent
    sx={viewLocationButtonSx} // Custom styles for the button
  >
    View Location {/* Button label */}
  </Button>
);


// Export the ViewLocationButton component as default
export default ViewLocationButton;