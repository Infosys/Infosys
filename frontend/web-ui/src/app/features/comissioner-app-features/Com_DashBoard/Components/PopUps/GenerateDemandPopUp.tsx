// GenerateDemandPopup component displays a modal dialog for generating a property tax demand
// Used to confirm and trigger the sending of a tax notice for an enumerated property

import React from "react";
import { Dialog, DialogTitle, DialogActions, Button, Typography, Box } from "@mui/material";
import {
  dialogStyles,
  dialogTitleBoxStyles,
  generateButtonStyles,
  cancelButtonStyles,
  dialogActionsStyles,
} from "../../Styles/PopUpsStyles/GenerateDemandPopUpStyles";

// Props for the GenerateDemandPopup component
interface GeneratePopupProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

// GenerateDemandPopup functional component
const GenerateDemandPopup: React.FC<GeneratePopupProps> = ({ open, onClose }) => (
  // Dialog component for the popup
  <Dialog sx={dialogStyles} open={open} onClose={onClose}>
    {/* Dialog title and description */}
    <DialogTitle>
      <Box sx={dialogTitleBoxStyles}>
        <Typography fontWeight={500} fontSize="18px" color="black">
          Generate Demand for this Property
        </Typography>
        <Typography fontWeight={300} fontSize="12px" color="black">
          Send Tax notice for enumerated property
        </Typography>
      </Box>
    </DialogTitle>
    {/* Action buttons for generating demand or cancelling */}
    <DialogActions sx={dialogActionsStyles}>
      <Button
        onClick={onClose}
        variant="contained"
        size="small"
        sx={generateButtonStyles}
      >
        Generate Demand
      </Button>
      <Button
        onClick={onClose}
        variant="outlined"
        size="small"
        sx={cancelButtonStyles}
      >
        Cancel action
      </Button>
    </DialogActions>
  </Dialog>
);

export default GenerateDemandPopup;