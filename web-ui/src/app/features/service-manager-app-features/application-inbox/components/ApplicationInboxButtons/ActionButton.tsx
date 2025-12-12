
/**
 * This component renders an action button with a dropdown menu for application inbox actions.
 * It allows the user to trigger actions such as reassigning an agent for a specific application.
 * When 'Reassign Agent' is selected, a dialog opens for agent reassignment.
 */
import { Menu, Button, MenuItem, Dialog, DialogContent } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from "react";
import {
  actionButtonSx,
  actionMenuPaperSx,
  actionMenuItemSx,
} from "../../styles/ApplicationInboxButtons/ActionButtonStyle";
import ApplicationInboxReassignmentBox from "../ApplicationInboxReassignmentBox/ApplicationInboxReassignmentBox";


// Props for the ActionButton component
interface ActionDropdownProps {
  selectedAction: string; // Currently selected action label
  onActionChange: (action: string) => void; // Callback when an action is selected
  ward: string; // Ward identifier for the application
  applicationId: string; // Application identifier
  assignedAgentId?: string; // (Optional) Currently assigned agent's ID
}


// Functional component to render an action button with a dropdown and dialog for agent reassignment
const ActionButton: React.FC<ActionDropdownProps> = ({
  selectedAction,
  onActionChange,
  ward,
  applicationId,
  assignedAgentId
}) => {
  // State for menu anchor element
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  // State for dialog visibility and ward context
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogWard, setDialogWard] = React.useState<string>("");

  // Handle button click to open the dropdown menu
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu item selection and open dialog if needed
  const handleMenuClose = (value?: string) => {
    if (value) {
      onActionChange(value);
      if (value === "Reassign Agent") {
        setDialogWard(ward);
        setDialogOpen(true);
      }
    }
    setAnchorEl(null);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {/* Action button with dropdown icon */}
      <Button
        onClick={handleButtonClick}
        endIcon={<ArrowDropDownIcon />}
        variant="contained"
        disableElevation
        sx={actionButtonSx}
      >
        {selectedAction}
      </Button>

      {/* Dropdown menu for actions */}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => handleMenuClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              ...actionMenuPaperSx,
              minWidth: anchorEl ? anchorEl.offsetWidth : undefined,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleMenuClose("Reassign Agent")}
          sx={actionMenuItemSx}
        >
          Reassign Agent
        </MenuItem>
      </Menu>

      {/* Dialog for agent reassignment */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}
      sx={{
    '& .MuiPaper-root': {
      minWidth: 500,
      borderRadius: '20px',
    },
  }}
      >
        <DialogContent>
          <ApplicationInboxReassignmentBox assignedAgentId={assignedAgentId} applicationId={applicationId} ward={dialogWard} onClose={handleDialogClose}/>
        </DialogContent>
      </Dialog>
    </>
  );
};


// Export the ActionButton component as default
export default ActionButton;