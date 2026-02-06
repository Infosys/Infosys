import React, { useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { useAddCommentLocalization } from "../../../../services/AgentLocalisation/localisation-addcomment";
import { fileUploadBoxSx, uploadIconSx, browseButtonSx } from "../styles/FileUploadBoxStyle";

interface FileUploadBoxProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadBox = ({ onFileChange }: FileUploadBoxProps) => {
  const {
    dragDropText,
    browseSystemText,
  } = useAddCommentLocalization();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to pass to onFileChange
      const fileList = e.dataTransfer.files;
      const event = {
        target: { files: fileList },
      } as React.ChangeEvent<HTMLInputElement>;
      onFileChange(event);
    }
  };

  return (
    <Box
      sx={fileUploadBoxSx(dragActive)}
      onClick={handleBoxClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadIcon sx={uploadIconSx} />
      <Typography variant="body1" color="textSecondary">
        {dragDropText}{" "}
        <Button
          variant="text"
          component="span"
          sx={browseButtonSx}
          onClick={(e) => {
            e.stopPropagation();
            handleBoxClick();
          }}
        >
          {browseSystemText}
        </Button>
      </Typography>
      <input
        id="file-upload"
        type="file"
        hidden
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </Box>
  );
};

export default FileUploadBox;