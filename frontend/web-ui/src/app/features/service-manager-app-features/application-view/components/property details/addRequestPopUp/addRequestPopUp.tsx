  
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
    Snackbar,
  } from "@mui/material";
  import MuiAlert from "@mui/material/Alert";
  import UploadIcon from '@mui/icons-material/Upload';
  import CloseIcon from "@mui/icons-material/Close";
  import DownloadIcon from "@mui/icons-material/Download";
  import {
    dialogPaperStyle,
    dialogTitleStyle,
    labelStyle,
    textFieldStyle,
    fileInputRoot,
    buttonBarStyle,
    cancelBtnStyle,
    submitBtnStyle,
  } from "../../../Styles/addRequestStyles/addRequestPopUpStyle";
 import pdfIcon from '../../../../application-view/Assets/add-comment-request/_thumbnail Vector.svg';
  
// Props for the RequestDialog component
type RequestDialogProps = Readonly<{
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Handler to close the dialog
    onSubmit: (comment: string, file?: File) => void; // Handler for submitting the request
  }>;


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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

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

    if(comment.trim() === "") {
      setSnackbarMsg("Please enter a comment before submitting.");
      setSnackbarOpen(true);
      return;
    }
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
        slotProps={{ paper: { sx: dialogPaperStyle } }}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
           {/* Dialog title */}
          <Typography sx={dialogTitleStyle}>Request/Comment</Typography>
          <Box sx={{ px: 3, mb: 0}}>
             {/* Label for the comment input */}
            <Typography sx={labelStyle}>Enter Request and Comment</Typography>
            <TextField
              multiline
              minRows={4}
              maxRows={6}
              variant="outlined"
              
              placeholder="Type here...."
              value={comment}
              onChange={e => setComment(e.target.value)}
              sx={textFieldStyle}
              slotProps={{
                htmlInput: {
                  style: {
                    fontSize: "15px",
                    resize: "vertical",
                    padding: "15px",
                    
                  },
                }
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
              <Box sx={{ display: "flex",justifyContent : "center", gap: 1 }}>
                <UploadIcon sx={{ fontSize: 50, color: "#8A8A8A"}} />
              </Box>
                <Typography sx={{ color: "#8A8A8A", fontSize: 15 }}>
                  
                  Click or drag file to upload (PDF, DOC, PNG etc.)
                </Typography>
            
            </Box>

            {/* Uploaded file display section */}
            {file && (
              <Box
                sx={{
                  backgroundColor: "#edecebff",
                  border: "1px solid #E4F2F2",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "flex-start",
                  p: 2,
                  maxWidth: 600,
                  gap: 2,
                  position: "relative"
                }}
              >
                {/* PDF File Icon and Name */}
                <Box>
                  {/* Custom PDF icon with label */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <img
                          src={pdfIcon}
                          alt="PDF Icon"
                        />
                        <Typography
                          title={file.name}
                        >
                          {file.name}
                        </Typography>
                     
                {/* Download button for the uploaded file */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon sx={{ color: "#155464" }} />}
                  sx={{
                    borderRadius: "14px",
                    borderColor: "#155464",
                    color: "#155464",
                    backgroundColor: "white",
                    fontWeight: 500,
                    fontSize: 14,
                    mr: 2,
                    px:5,
                    '&:hover': { borderColor: "#155464", backgroundColor: '#f2f7fa' }
                  }}
                  onClick={handleDownloadFile}
                >
                  Download
                </Button>

                 </Box>
                </Box>
                {/* Remove (close) icon for the uploaded file */}
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                    color: "#155464",
                    borderRadius: "25%",
                    borderLeft: "1px solid #d4d3d1ff",
                    borderBottom: "1px solid #d4d3d1ff",
                    // background: "#d4d3d1ff",
                    padding: "0px",
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

          {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
            {snackbarMsg}
          </MuiAlert>
        </Snackbar>
        </DialogContent>
      </Dialog>
    );
  }