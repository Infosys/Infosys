
// RequestDialog component allows users to submit a comment and optionally upload a file
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import {
  requestDialogPaperStyle,
  requestDialogTitleStyle,
  requestDialogContentStyle,
  requestTextFieldStyle,
  fileUploadBoxStyle,
  uploadIconStyle,
  uploadTextStyle,
  requestDialogActionsStyle,
  cancelBtnStyle,
  submitBtnStyle,
  closeIconButtonStyle,
} from '../../../styles/addRequestStyles/requestDialog';


// Props for RequestDialog
interface RequestDialogProps {
  open: boolean; // Whether the dialog is open
  onClose: () => void; // Handler to close the dialog
  onSubmit: (comment: string, file?: File) => void; // Handler for submitting the comment and file
}


// Functional component for the request dialog
const RequestDialog: React.FC<RequestDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  // State for the comment input
  const [comment, setComment] = useState('');
  // State for the selected file
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  // Handle submit button click
  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment, selectedFile); // Call parent handler
      setComment(''); // Reset comment
      setSelectedFile(undefined); // Reset file
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  // Handle dialog close (reset state)
  const handleClose = () => {
    setComment('');
    setSelectedFile(undefined);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper:{
          sx: requestDialogPaperStyle
        }
      }}
    >
      {/* Dialog title with close button */}
      <DialogTitle sx={requestDialogTitleStyle}>
        <Typography variant="h6" component="div">
          Add Comment
        </Typography>
        <IconButton
          edge="end"
          onClick={handleClose}
          aria-label="close"
          sx={closeIconButtonStyle}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog content: comment input and file upload */}
      <DialogContent sx={requestDialogContentStyle}>
        {/* Multiline text field for comment */}
        <TextField
          autoFocus
          margin="dense"
          label="Enter your comment"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={requestTextFieldStyle}
        />

        {/* File upload box (clickable) */}
        <Box
          sx={fileUploadBoxStyle}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <UploadIcon sx={uploadIconStyle} />
          <Typography variant="body2" sx={uploadTextStyle}>
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : 'Click to upload a document (optional)'}
          </Typography>
        </Box>
      </DialogContent>

      {/* Dialog actions: Cancel and Submit buttons */}
      <DialogActions sx={requestDialogActionsStyle}>
        <Button onClick={handleClose} sx={cancelBtnStyle}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!comment.trim()}
          sx={submitBtnStyle}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Export the RequestDialog component as default
export default RequestDialog;