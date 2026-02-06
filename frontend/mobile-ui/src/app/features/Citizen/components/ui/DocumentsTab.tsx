// DocumentsTab.tsx displays and manages property documents for the Citizen property details page.
// It fetches document metadata, retrieves file blobs, and provides UI for viewing, downloading, editing, and uploading documents.
// Uses MUI for UI, Redux Toolkit Query for API calls, and localization for labels/messages.
//
// Main responsibilities:
// - Transform API document data for display
// - Fetch file blobs for each document
// - Show upload cards for missing documents
// - Handle view/download/edit actions
// - Display loading and error states
//
// Props: property (CitizenPropertyData) - the property whose documents are shown
import { Box, Button, IconButton, Paper, Stack, Typography, CircularProgress } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AddAPhotoOutlined, TaskOutlined } from '@mui/icons-material';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../../components/Loader';
import type { CitizenPropertyData } from '../../models/CitizenPropertiesPageModel/CitizenPropertyPageModel';
import { useLazyGetFileBlobQuery } from '../../api/CitizenDocumentPageApi/fileStoreApi';

const iconColor = '#C84C0E';
const TENANT_ID = 'pg';

// DocumentDisplay defines the shape of document data for UI rendering
interface DocumentDisplay {
  title: string;
  filename?: string;
  size?: string;
  date?: string;
  documentType?: string;
  fileStoreId?: string;
  action?: string;
  isUpload?: boolean;
  isChooseFile?: boolean;
}

// Converts property.Documents from API format to DocumentDisplay[] for UI rendering
function buildDocumentDisplayList(property: CitizenPropertyData): DocumentDisplay[] {
  if (!property?.Documents || property.Documents.length === 0) {
    return [];
  }

  const list: DocumentDisplay[] = [];

  for (const doc of property.Documents) {
    const hasFile = doc.FileStoreID && doc.FileStoreID.trim() !== '';
    
    list.push({
      title: doc.DocumentType || 'Document',
      filename: doc.DocumentName || '',
      size: '',
      date: doc.UploadDate ? new Date(doc.UploadDate).toLocaleDateString() : '',
      documentType: doc.DocumentType,
      fileStoreId: doc.FileStoreID,
      action: doc.action,
      isUpload: !hasFile,
      isChooseFile: !hasFile,
    });
  }
  
  return list;
}

// Props for Documents component: expects property data
interface DocumentsProps {
  property: CitizenPropertyData;
}

// Documents component: displays document cards, handles file fetch/view/download/upload
const Documents: FC<DocumentsProps> = ({ property }) => {
  // Localization, state, and hooks
  const lang = useAppSelector((state) => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession('CITIZEN')!; // Localized messages
  const [documentDisplayList, setDocumentDisplayList] = useState<DocumentDisplay[]>([]); // UI document list
  const [fileBlobs, setFileBlobs] = useState<Record<string, Blob>>({}); // Cached file blobs
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({}); // File fetch errors
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({}); // Per-file loading state

  // RTK Query lazy hook for fetching file blobs
  const [fetchFileBlob] = useLazyGetFileBlobQuery();

  // Build document display list from property data
  useEffect(() => {
    if (!property) return;
    const initialDocs = buildDocumentDisplayList(property);
    setDocumentDisplayList(initialDocs);
  }, [property]);

  // Fetch file blobs for each document (sequentially)
  useEffect(() => {
    if (documentDisplayList.length === 0) return;

    const fetchFilesSequentially = async () => {
      const blobs: Record<string, Blob> = {};
      const errors: Record<string, string> = {};
      const loading: Record<string, boolean> = {};

      for (const doc of documentDisplayList) {
        // Skip if no fileStoreId or is upload needed
        if (!doc.fileStoreId || doc.isUpload) continue;

        try {
          // Set loading state for this file
          loading[doc.fileStoreId] = true;
          setLoadingFiles({ ...loading });

          // Fetch file blob from filestore
          const blob = await fetchFileBlob({
            fileStoreId: doc.fileStoreId,
            tenantId: TENANT_ID,
          }).unwrap();

          if (!blob) {
            throw new Error('No blob returned from filestore');
          }

          blobs[doc.fileStoreId] = blob;

          // Update document size in UI
          const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
          setDocumentDisplayList(prev => 
            prev.map(d => 
              d.fileStoreId === doc.fileStoreId 
                ? { ...d, size: `${sizeInMB} MB` }
                : d
            )
          );

          // Update file blob cache
          setFileBlobs({ ...blobs });

        } catch (error) {
          // Handle file fetch error
          console.error(`Error fetching file ${doc.fileStoreId}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file';
          const apiError = error as { data?: { message?: string } };
          errors[doc.fileStoreId] = apiError.data?.message || errorMessage;
          setFileErrors({ ...errors });
        } finally {
          // Clear loading state for this file
          loading[doc.fileStoreId] = false;
          setLoadingFiles({ ...loading });
        }
      }
    };

    fetchFilesSequentially();
  }, [documentDisplayList.length, fetchFileBlob]);

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // No property data: render nothing
  if (!property) return null;

  // Sort documents: upload-needed first, then normal docs
  const sortedDocuments =
    documentDisplayList.length > 0
      ? [...documentDisplayList].sort((a, b) => {
          const aNeedsUpload = a.isUpload || a.isChooseFile;
          const bNeedsUpload = b.isUpload || b.isChooseFile;
          if (aNeedsUpload === bNeedsUpload) return 0;
          return aNeedsUpload ? -1 : 1;
        })
      : [];

  // View document in new tab using cached blob
  const handleViewDocument = async (fileStoreId: string) => {
    try {
      const blob = fileBlobs[fileStoreId];
      if (!blob) {
        console.error('File not found in cache');
        alert('File is still loading or not available. Please try again.');
        return;
      }

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to view document. Please try again.');
    }
  };

  // Download document using cached blob
  const handleDownloadDocument = async (fileStoreId: string, filename: string) => {
    try {
      const blob = fileBlobs[fileStoreId];
      if (!blob) {
        console.error('File not found in cache');
        alert('File is still loading or not available. Please try again.');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  

  // Choose file handler for upload (stub)
  const handleChooseFile = (documentType: string) => {
    console.log('Choose file for:', documentType);
  };

  // Render document cards: upload-needed and normal documents
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.2,
        borderRadius: 3,
        bgcolor: '#fff',
        mb: 1.2,
      }}
    >
      <Typography fontWeight={700} mb={1} fontSize={16}>
        {messages['citizen.my-properties'][lang]['documents']}
      </Typography>

      {sortedDocuments && sortedDocuments.length > 0 ? (
        <Stack gap={2}>
          {sortedDocuments.map((doc) => {
            const isChooseFile = doc.isUpload || doc.isChooseFile;
            const borderColor = isChooseFile ? '#C84C0E' : '#e0e0e0';
            const isFileLoading = loadingFiles[doc.fileStoreId || ''];
            const hasError = Boolean(fileErrors[doc.fileStoreId || '']);

            // Helper function to render document icon
            const renderDocumentIcon = () => {
              if (isFileLoading) {
                return <CircularProgress size={32} sx={{ color: iconColor }} />;
              }
              if (hasError) {
                return <ErrorOutlineIcon sx={{ fontSize: 32, color: '#f44336' }} />;
              }
              return <TaskOutlined sx={{ fontSize: 32, color: '#222' }} />;
            };

            // Helper function to render document status text
            const renderDocumentStatus = () => {
              if (hasError) {
                return <span style={{ color: '#c62828' }}>{fileErrors[doc.fileStoreId || '']}</span>;
              }
              if (isFileLoading) {
                return 'Loading file...';
              }
              return <>{doc.size && `${doc.size} • `}{doc.date}</>;
            };

            // Upload-needed document card
            if (isChooseFile) {
              return (
                <Paper
                  key={doc.fileStoreId}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: `2px solid ${borderColor}`,
                    bgcolor: '#fff',
                    px: 2,
                    py: 1.3,
                    display: 'grid',
                    gridTemplateColumns: '44px 1.8fr 1.2fr 1.5fr',
                    alignItems: 'center',
                    gap: 0,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" marginRight={2}>
                    <TaskOutlined sx={{ fontSize: 32, color: '#222' }} />
                  </Box>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    color="#222"
                    sx={{ textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word', pr: 2 }}
                  >
                    {doc.title}
                  </Typography>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <AddAPhotoOutlined sx={{ fontSize: 24, color: '#666' }} />
                    <Typography fontSize={8} color="#999" mt={0.2}>
                      Take Image
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2.5,
                        py: 0.5,
                        minWidth: 110,
                        fontSize: 12,
                        boxShadow: 'none',
                        bgcolor: '#C84C0E',
                        '&:hover': { bgcolor: '#a53a0c' },
                      }}
                      size="medium"
                      onClick={() => handleChooseFile(doc.documentType || '')}
                    >
                      Choose File
                    </Button>
                    <Typography fontSize={11} color="#888" mt={0.5} textAlign="center">
                      PDF, JPG, PNG<br />(Max 5MB)
                    </Typography>
                  </Box>
                </Paper>
              );
            }

            // Normal document card: view, download, edit, error, loading
            return (
              <Paper
                key={doc.fileStoreId}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `2px solid ${hasError ? '#f44336' : borderColor}`,
                  bgcolor: hasError ? '#ffebee' : '#fff',
                  px: 2,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isFileLoading ? 0.6 : 1,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="center" marginRight={2}>
                  {renderDocumentIcon()}
                </Box>
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography
                      fontWeight={600}
                      fontSize={14}
                      color="#222"
                      sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', flex: 1 }}
                    >
                      {doc.title}
                    </Typography>
                    {hasError && (
                      <Box
                        sx={{
                          bgcolor: '#ffcdd2',
                          color: '#c62828',
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          fontSize: 10,
                          fontWeight: 600,
                          mr: 1,
                        }}
                      >
                        FILE NOT FOUND
                      </Box>
                    )}
                      {/* <IconButton 
                        size="small" 
                        sx={{ color: iconColor, ml: 0.5 }}
                        onClick={() => handleEditDocument(doc.fileStoreId || '')}
                        disabled={isFileLoading || hasError}
                      >
                        <EditOutlinedIcon />
                      </IconButton> */}
                  </Box>
                  <Typography
                    fontSize={12}
                    color="#666"
                    sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                  >
                    {doc.filename}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography fontSize={10} color="#888" sx={{ flex: 1 }}>
                      {renderDocumentStatus()}
                    </Typography>
                    <IconButton 
                      size="small" 
                      sx={{ color: iconColor }}
                      onClick={() => handleViewDocument(doc.fileStoreId || '')}
                      disabled={!fileBlobs[doc.fileStoreId || ''] || hasError || isFileLoading}
                    >
                      <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: iconColor }}
                      onClick={() => handleDownloadDocument(doc.fileStoreId || '', doc.filename || 'document')}
                      disabled={!fileBlobs[doc.fileStoreId || ''] || hasError || isFileLoading}
                    >
                      <DownloadOutlinedIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Typography color="#888" fontSize={14} mt={1}>
          No documents found.
        </Typography>
      )}
    </Paper>
  );
};

export default Documents;