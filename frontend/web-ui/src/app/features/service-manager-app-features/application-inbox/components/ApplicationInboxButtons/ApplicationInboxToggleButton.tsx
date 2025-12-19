
/**
 * This component renders a styled toggle switch for use in the application inbox.
 * It can be used to toggle states such as enabling or disabling features for an application.
 */
import Switch from "@mui/material/Switch";
import { toggleButtonSx } from "../../styles/ApplicationInboxButtons/ApplicationInboxToggleButtonStyle";


// Functional component to render a custom-styled toggle switch
const ApplicationInboxToggleButton = (props: any) => (
  <Switch
    {...props}
    sx={toggleButtonSx}
  />
);


// Export the ApplicationInboxToggleButton component as default
export default ApplicationInboxToggleButton;