// This file defines the DocumentPreview component, which displays a preview for a document or image
// fetched from a filestore. It handles loading, error, and preview states for both images and other files.

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, type SxProps, type Theme } from "@mui/material";
// import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useGetFileFromFilestoreQuery } from '../../api/getFileFromFilestore'


// Props for the DocumentPreview component
interface DocumentPreviewProps {
  fileStoreId: string; // ID of the file in the filestore
  fileName: string; // Name of the file to display as alt text
  isImage: boolean; // Whether the file is an image
  sx?: SxProps<Theme>; // Optional custom styles
}

// Functional component for displaying a document or image preview
const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileStoreId,
  fileName,
  isImage,
  sx,
}) => {
  // Fetch the file blob from the filestore using a custom hook
  const { data: blob, isLoading, isError } = useGetFileFromFilestoreQuery({ fileStoreId });
  // State to store the generated object URL for the blob
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // When the blob changes, create a new object URL and clean up the old one
  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => { URL.revokeObjectURL(url); };
    }
  }, [blob]);

  // Show a loading spinner while the file is being fetched
  if (isLoading) return <Box sx={{ ...sx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;
  // Show a fallback icon if there is an error or no blob URL
  if (!blobUrl || isError) return isImage ? <ImageOutlinedIcon sx={sx} /> : <ImageOutlinedIcon sx={{ ...sx, fontSize: 45 }} />;

  // If the file is an image, display it with preview and click-to-open functionality
  if (isImage) {
    return <Box   component="img"
      src={blobUrl ?? ""}
      alt={fileName}
      sx={{
        ...sx,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "12px",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (blobUrl) {
          window.open(blobUrl, "_blank", "noopener");
        }
      }}
    />
  }
  // For non-image files, show an icon button that opens the file in a new tab
  return (
    <IconButton 
    href={blobUrl} 
    target="_blank" 
    rel="noopener" 
    sx={sx}
    onClick={(e) => e.stopPropagation()}
    >
      <ImageOutlinedIcon sx={{ fontSize: 45 }} />
    </IconButton>
    // <Box sx={{ ...sx, width: '100%', height: '100%' }}>
    //   <embed src={blobUrl} type="application/pdf" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
    // </Box>
  );
};

export default DocumentPreview;