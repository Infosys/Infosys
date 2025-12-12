
/**
 * This component renders a styled button for reassigning an application in the inbox.
 * It is typically used to trigger the reassignment action for a selected application.
 */
import Button from "@mui/material/Button";
import { reassignButtonSx } from "../../styles/ApplicationInboxButtons/ApplicationInboxReassignButtonStyle";


// Props for the ApplicationInboxReassignButton component
interface ApplicationInboxReassignButtonProps {
  onClick: () => void;    // Handler for button click
  disabled?: boolean;     // Whether the button is disabled
  text: string;           // Button label text
}


// Functional component to render a contained, styled button for reassignment
const ApplicationInboxReassignButton: React.FC<ApplicationInboxReassignButtonProps> = ({ onClick, disabled, text }) => (
  <Button
    variant="contained"
    sx={reassignButtonSx}
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </Button>
);


// Export the ApplicationInboxReassignButton component as default
export default ApplicationInboxReassignButton;