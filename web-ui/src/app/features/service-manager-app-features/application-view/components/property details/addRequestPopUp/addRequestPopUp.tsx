  
// Popup dialog component for submitting a request or comment, with optional file upload.
import React, { useState, useRef } from "react";
  import {
    Dialog,
    DialogContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Box,
  } from "@mui/material";
  import UploadIcon from '@mui/icons-material/Upload';
  import CloseIcon from "@mui/icons-material/Close";
  import DownloadIcon from "@mui/icons-material/Download";
  import {
    dialogPaperStyle,
    dialogTitleStyle,
    closeButtonStyle,
    labelStyle,
    textFieldStyle,
    fileInputRoot,
    buttonBarStyle,
    cancelBtnStyle,
    submitBtnStyle,
  } from "../../../Styles/addRequestStyles/addRequestPopUpStyle";

  
// Props for the RequestDialog component
type RequestDialogProps = {
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Handler to close the dialog
    onSubmit: (comment: string, file?: File) => void; // Handler for submitting the request
  };


  export default function RequestDialog({
    open,
    onClose,
    onSubmit,
  }: RequestDialogProps) {
    // State for the comment input
  const [comment, setComment] = useState("");
    // State for the uploaded file
  const [file, setFile] = useState<File | null>(null);
    // Ref for the file input element
  const inputRef = useRef<HTMLInputElement>(null);

    // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        e.target.value = "";
      }
    };

    // Handler to remove the selected file
  const handleRemoveFile = () => {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    // Handler to download the selected file
  const handleDownloadFile = () => {
      if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    // Handler for submitting the request/comment and file
  const handleSubmit = () => {
      console.log("Submitting file:", file);
      onSubmit(comment, file ?? undefined);
      setComment("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: dialogPaperStyle }}
        maxWidth="xs"
        fullWidth
      >
        {/* Close button at the top right */}
        <IconButton aria-label="close" onClick={onClose} sx={closeButtonStyle}>
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, mt: 2.5 }}>
           {/* Dialog title */}
          <Typography sx={dialogTitleStyle}>Request/Comment</Typography>
          <Box sx={{ px: 3, mb: 0 }}>
             {/* Label for the comment input */}
            <Typography sx={labelStyle}>Enter Request and Comment</Typography>
            {/* <Typography sx={contentStyle}>
              Enter Request or Comment
              Please add the updated Building Permission, 
              the new Sale Deed to update the document and for verification.
            </Typography> */}
            <TextField
              multiline
              minRows={4}
              maxRows={6}
              variant="outlined"
              placeholder="Enter Request or Comment Please add the updated Building Permission, the new Sale Deed to update the document and for verification."
              value={comment}
              onChange={e => setComment(e.target.value)}
              sx={textFieldStyle}
              inputProps={{
                style: {
                  fontSize: "15px",
                  resize: "vertical",
                  padding: "15px",
                },
              }}
            />
            {/* File upload area */}
            <Box
              sx={fileInputRoot}
              component="label"
            >
              <input
                ref={inputRef}
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <UploadIcon sx={{ fontSize: 50, color: "#8A8A8A" }} />
              </Box>
                <Typography sx={{ color: "#8A8A8A", fontSize: 15 }}>
                  
                  Click or drag file to upload (PDF, DOC, PNG etc.)
                </Typography>
            
            </Box>

            {/* Uploaded file display section */}
            {file && (
              <Box
                sx={{
                  backgroundColor: "#FAFFFF",
                  border: "1px solid #E4F2F2",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  maxWidth: 600,
                  gap: 2,
                  position: "relative"
                }}
              >
                {/* PDF File Icon and Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {/* Custom PDF icon with label */}
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "6px",
                    background: "#F8E9E9",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    position: "relative",
                    mr: 1
                  }}>
                    <Box sx={{
                      position: "absolute",
                      bottom: 8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "#C92A2A",
                      borderRadius: "3px",
                      px: "4px",
                      py: "1px",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: 0,
                    }}>
                      .pdf
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: "#868686",
                      fontWeight: 500,
                        width:'150px',
                      height:'20px',
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </Typography>
                </Box>
                {/* Download button for the uploaded file */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon sx={{ color: "#155464" }} />}
                  sx={{
                    borderRadius: "24px",
                    borderColor: "#155464",
                    color: "#155464",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 14,
                    ml: 12,
                    mt:4,
                    minWidth: 100,
                    '&:hover': { borderColor: "#155464", backgroundColor: '#f2f7fa' }
                  }}
                  onClick={handleDownloadFile}
                >
                  Download
                </Button>
                {/* Remove (close) icon for the uploaded file */}
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                    color: "#ff0000ff",
                    padding: "1px",
                    "&:hover": { background: "#f4f8fc" }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>
            )}
            {/* Action buttons for cancel and submit */}
            <Box sx={buttonBarStyle}>
              <Button sx={cancelBtnStyle} onClick={onClose}>
                Cancel
              </Button>
              <Button sx={submitBtnStyle} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }