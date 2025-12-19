
// ConfirmationDialog component displays a modal dialog for confirming or rejecting an action
import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  confirmDialogPaperStyle,
  confirmTitleStyle,
  confirmDescStyle,
  confirmNoteStyle,
  confirmButtonBar,
  rejectBtn,
  confirmBtn,
  closeButtonStyle,
} from '../../../styles/addRequestStyles/ConfirmationDialog';


// Props for ConfirmationDialog
type ConfirmationDialogProps = {
  open: boolean; // Whether the dialog is open
  onReject: () => void; // Handler for reject action
  onConfirm: () => void; // Handler for confirm action
  onClose?: () => void;  // Optional handler for closing the dialog
};


// Functional component for the confirmation dialog
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onReject,
  onConfirm,
  onClose,
}) => (
  <Dialog
    open={open}
    onClose={onClose || onReject} // Close dialog on backdrop click or close button
    PaperProps={{ sx: confirmDialogPaperStyle }}
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
      {/* Action buttons: Reject and Confirm */}
      <Box sx={confirmButtonBar}>
        <Button sx={rejectBtn} onClick={onReject}>
          Reject
        </Button>
        <Button 
          sx={confirmBtn} 
          onClick={() => {
            onConfirm();
          }} 
          autoFocus
        >
          Confirm
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

// Export the ConfirmationDialog component as default
export default ConfirmationDialog;