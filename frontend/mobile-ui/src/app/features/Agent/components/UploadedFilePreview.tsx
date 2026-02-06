import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import pdfIcon from "../../../assets/Agent/pdf_icon.svg";
import { useAddCommentLocalization } from "../../../../services/AgentLocalisation/localisation-addcomment";
import {
  uploadFilePreviewContainerSx,
  fileInfoBoxSx,
  fileIconSx,
  fileNameSx,
  closeButtonSx,
  downloadButtonBoxSx,
  downloadButtonSx,
} from "../styles/UploadedFilePreviewStyle";

interface UploadedFilePreviewProps {
  name: string;
  onRemove: () => void;
  onDownload: () => void;
}

const UploadedFilePreview: React.FC<UploadedFilePreviewProps> = ({
  name,
  onRemove,
  onDownload,
}) => {
  const { downloadText } = useAddCommentLocalization();
  return (
    <Box sx={uploadFilePreviewContainerSx}>
      <Box sx={fileInfoBoxSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={pdfIcon} alt="PDF" style={fileIconSx} />
          <Typography sx={fileNameSx}>{name}</Typography>
        </Box>
        <IconButton
          size="small"
          sx={closeButtonSx}
          onClick={onRemove}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={downloadButtonBoxSx}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon sx={{ color: "#c84c03" }} />}
          sx={downloadButtonSx}
          onClick={onDownload}
        >
          {downloadText}
        </Button>
      </Box>
    </Box>
  );
};

export default UploadedFilePreview;