
/**
 * This component renders a filter button for the application inbox.
 * When clicked, it opens a dialog containing the property filter form.
 * Useful for filtering applications based on various criteria.
 */
import React from "react";
import Button from "@mui/material/Button";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { filterButtonSx, filterIconSx, DialogBoxSx } from "../../styles/ApplicationInboxButtons/ApplicationInboxFilterButtonStyle";
import PropertyFilter from "../PropertyFilter/PropertyFilter";


// Functional component to render a filter button and dialog for property filtering
const ApplicationInboxFilterButton = () => {
  // State to control dialog visibility
  const [open, setOpen] = React.useState(false);

  // Open the filter dialog
  const handleClick = () => setOpen(true);
  // Close the filter dialog
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Button to open the filter dialog */}
      <Button
        variant="outlined"
        startIcon={<FilterAltOutlinedIcon sx={filterIconSx} />}
        onClick={handleClick}
        sx={filterButtonSx}
      >
        Filter
      </Button>
      {/* Dialog containing the property filter form */}
      <Dialog sx={DialogBoxSx} open={open} onClose={handleClose}>
        <DialogContent>
          <PropertyFilter onClose={handleClose}/>
        </DialogContent>
      </Dialog>
    </>
  );
};


// Export the ApplicationInboxFilterButton component as default
export default ApplicationInboxFilterButton;