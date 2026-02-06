
// Confirmation dialog popup for confirming or rejecting a request/comment action.
import React from "react";
import { Dialog, DialogContent, Typography, Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  confirmDialogPaperStyle,
  confirmTitleStyle,
  confirmDescStyle,
  confirmNoteStyle,
  confirmButtonBar,
  rejectBtn,
  confirmBtn,
  closeButtonStyle,
} from "../../../Styles/addRequestStyles/confirmationPopUp";


// Props for the ConfirmationDialog component
type ConfirmationDialogProps = {
  open: boolean; // Whether the dialog is open
  onReject: () => void; // Handler for rejecting the action
  onConfirm: () => void; // Handler for confirming the action
  onClose?: () => void;  // Optional handler for closing the dialog
};


/**
 * ConfirmationDialog component displays a modal dialog for confirming or rejecting an action.
 * Used to confirm irreversible actions such as submitting a request or comment.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onReject,
  onConfirm,
  onClose,
}) => (
  <Dialog
    open={open}
    onClose={onClose || onReject}
    slotProps={{ paper: { sx: confirmDialogPaperStyle } }}
    maxWidth="xs"
    fullWidth
    hideBackdrop={false}
  >
    {/* Close button at the top right */}
    <IconButton
      aria-label="close"
      onClick={onClose || onReject}
      sx={closeButtonStyle}
    >
      <CloseIcon />
    </IconButton>
    <DialogContent sx={{ p: 0, pt: 3.5 }}>
      {/* Dialog title */}
      <Typography sx={confirmTitleStyle}>Confirm Comment</Typography>
      {/* Confirmation message */}
      <Typography sx={confirmDescStyle}>
        Are you sure you want to Confirm this request?
      </Typography>
      {/* Note about irreversibility */}
      <Typography sx={confirmNoteStyle}>
        This action is irreversible.
      </Typography>
      {/* Action buttons for reject and confirm */}
      <Box sx={confirmButtonBar}>
        <Button sx={rejectBtn} onClick={onReject}>
          Reject
        </Button>
        <Button sx={confirmBtn} onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

export default ConfirmationDialog;