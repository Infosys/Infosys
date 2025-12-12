import React, { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import pdfFileIcon from "../../Assets/pdf-file-icon.svg";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import {
  dialogPaperSx,
  descriptionBoxSx,
  dragDropBoxSx,
  uploadedFilePaperSx,
  downloadButtonSx,
  dialogActionsSx,
  cancelButtonSx,
  submitButtonSx,
} from "../../Styles/PopUpsStyle/UploadMapFilePopUpStyle";

interface UploadMapFilePopUpProps {
  open: boolean;
  onClose: () => void;
}

interface UploadedFilePreviewProps {
  file: File;
  onDownload: () => void;
  onRemove: () => void;
}

const UploadedFilePreview: React.FC<UploadedFilePreviewProps> = ({
  file,
  onDownload,
  onRemove,
}) => (
  <Paper variant="outlined" sx={uploadedFilePaperSx}>
    <img src={pdfFileIcon} alt="PDF" style={{ width: 33, height: 36, marginRight: 8 }} />
    <Typography sx={{ flex: 1, fontWeight: 500 }}>
      {file.name}
    </Typography>
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={onDownload}
      sx={downloadButtonSx}
    >
      Download
    </Button>
    <IconButton
      size="small"
      onClick={onRemove}
      sx={{ ml: 1 }}
      aria-label="Remove file"
    >
      <CloseIcon />
    </IconButton>
  </Paper>
);

const UploadMapFilePopUp: React.FC<UploadMapFilePopUpProps> = ({
  open,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    // TODO: Implement actual upload logic here
    setSelectedFile(null);
    setDescription("");
    onClose();
  };

  const openFileDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: dialogPaperSx }}
    >
      <DialogTitle sx={{ pb: 1, mb: 0 }}>
        <Typography fontSize={20} fontWeight={700}>
          Upload File
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {/* Description Input */}
        <Box sx={descriptionBoxSx}>
          <Typography fontStyle="italic" fontSize={14} fontWeight={300}>
            Enter Description
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            inputProps={{ maxLength: 200 }}
          />
        </Box>
        {/* Drag & Drop Area */}
        <Box
          sx={dragDropBoxSx}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          <FileUploadIcon sx={{ fontSize: 40, color: "#BDBDBD", mb: 1 }} />
          <Typography color="#757575" fontSize={14}>
            Drag and Drop your file or{" "}
            <span
              style={{
                color: "#0B4B66",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={openFileDialog}
            >
              Browse system
            </span>
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".shp,.geojson"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
        {/* File Preview */}
        {selectedFile && (
          <UploadedFilePreview
            file={selectedFile}
            onDownload={handleDownload}
            onRemove={handleRemoveFile}
          />
        )}
        <Typography fontSize={13} color="#757575" mt={1}>
          Attach all documents.
        </Typography>
      </DialogContent>
      {/* Actions */}
      <DialogActions sx={dialogActionsSx}>
        <Button
          variant="outlined"
          sx={cancelButtonSx}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={submitButtonSx}
          onClick={handleSubmit}
          disabled={!selectedFile || !description}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadMapFilePopUp;