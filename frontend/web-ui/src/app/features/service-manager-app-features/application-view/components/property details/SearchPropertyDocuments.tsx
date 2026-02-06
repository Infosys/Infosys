/**
 * SearchPropertyDocuments.tsx
 *
 * This file provides a React component for displaying and managing property-related documents.
 * It allows users to view, download, and update the status (verify/reject) of documents associated with a property.
 * Documents can be filtered by uploader role (All, Citizen, Agent).
 * Integrates with backend APIs for fetching documents and updating their status.
 */
import React, { useState } from "react";
import { Box, Typography, IconButton, Button, FormControl, Select, MenuItem, Menu } from "@mui/material";
import taskSvg from "../../Assets/documentSectionIcon/task.svg";
import searchActivitySvg from "../../Assets/documentSectionIcon/search_activity.svg";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  documentsCardOuterStyle,
  documentsCardHeaderStyle,
  documentsTitleStyle,
  documentsSubtitleStyle,
  documentsListStyle,
  documentRowStyle,
  documentIconBoxStyle,
  documentTextBoxStyle,
  documentTitleStyle,
  documentMetaStyle,
  verifiedContainerStyle,
  verifiedTextStyle,
  verifiedIconBoxStyle,
  documentIconButtonStyle,
  SelectButtonStyle,
  EachDocumentRowStyle,
  DropdownStyle,
  PendingTextStyle,
  rejectedTextStyle,
  CancelIconBoxStyle,
  rejectedContainerStyle,
  PendingContainerStyle,
  PendingIconBoxStyle
} from "../../Styles/searchPropertyStyles/DocumentsCardStyle";
import { useGetApplicationByApplicationIdQuery } from "../../api/applicationApi";
import { useGetUserByIdQuery, useUpdateDocumentActionMutation } from '../../api/documentsApi';
import { useGetFileFromFilestoreQuery } from "../../api/fileStoreApi";
// Renders a single document row with actions (view, download, verify, reject) and status display.
function DocumentRow({ doc, isLastRow, assesseeUser }: Readonly<{ doc: any; isLastRow: boolean; assesseeUser?: any }>) {
  // Extract file store ID for fetching the document file
  const fileStoreId = doc.FileStoreID;
  // Fetch the file blob from the backend using the file store ID
  const { data: fileBlob, isSuccess } = useGetFileFromFilestoreQuery(
    typeof fileStoreId === "string" || typeof fileStoreId === "number"
      ? { fileStoreId: fileStoreId.toString() }
      : { fileStoreId: "" },
    { skip: !fileStoreId }
  );
  // Local state for the object URL to view/download the file
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);

  // RTK mutation for updating document action (verify/reject)
  const [updateDocumentAction, { isLoading: isUpdating }] = useUpdateDocumentActionMutation();

  // Local action state: reflects the current status of the document (pending, verified, rejected)
  const [localAction, setLocalAction] = React.useState<string>(
    doc.action ? doc.action.trim().toUpperCase() : "PENDING"
  );
  // State for managing the action menu anchor
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Effect: create an object URL for the file blob when available, and clean up on unmount
  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (fileBlob && isSuccess) {
      objectUrl = URL.createObjectURL(fileBlob);
      setFileUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setFileUrl(null);
    };
  }, [fileBlob, isSuccess]);

  // Resolve uploader information using helper function
  const { uploaderRole, uploaderName, uploadedBy } = getUploaderInfo(doc, assesseeUser);

  // Extract and format the file size for display
  const rawSize = doc.Size ?? doc.size ?? doc.SizeInBytes ?? doc.sizeInBytes ?? doc.FileSize ?? null;
  const sizeDisplay = getFileSizeDisplay(rawSize);

  // Format the upload date as DD/MM/YY
  const formattedDate = formatUploadDate(doc?.UploadDate);

  // Handle verify/reject actions: update UI optimistically, call API, revert on error
  const handleActionSelect = async (action: "VERIFIED" | "REJECTED") => {
    const previousAction = localAction;
    
    try {
      setAnchorEl(null);
      // Optimistically update UI first
      setLocalAction(action);
      
      // Call API to persist the change
      await updateDocumentAction({
        documentId: doc.ID,
        action: action
      }).unwrap();
      
      console.log(`Document ${doc.ID} action updated to ${action}`);
    } catch (error) {
      // Revert optimistic update on error
      setLocalAction(previousAction);
      console.error(`Failed to update document ${doc.ID} action to ${action}:`, error);
      // You could add toast notification here
    }
  };

  return (
    <Box
      sx={{
        ...documentRowStyle(isLastRow),
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        px: { xs: 1, sm: 2, md: 3 },
        pb: { xs: 3, sm: 3 },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          ...EachDocumentRowStyle,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          width: '100%',
          gap: { xs: 2, sm: 2 },
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ ...documentIconBoxStyle, flexShrink: 0, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
          <Box component="img" src={taskSvg} alt="document icon" sx={{ width: 38, height: 38 }} />
        </Box>
        <Box
          sx={{
            ...documentTextBoxStyle,
            minWidth: 0,
            flex: 1,
            pr: { xs: 0, sm: 2 },
            pb: { xs: 1, sm: 0 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              ...documentTitleStyle,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: 180, sm: 240, md: 320 },
            }}
          >
            {doc.DocumentType}
          </Typography>
          <Typography
            sx={{
              ...documentMetaStyle,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: 180, sm: 240, md: 320 },
            }}
          >
            {doc.DocumentName}
          </Typography>
          <Typography sx={{ ...documentMetaStyle, mt: 0.5 }}>
            {sizeDisplay ? `${sizeDisplay} · ` : ''}Date : {formattedDate}
          </Typography>
          <Typography sx={{ ...documentMetaStyle, mt: 0.5 }}>
            {uploaderRole ? `${uploaderRole} - ` : ''}Uploaded by - {uploaderName?.trim() ? uploaderName : uploadedBy ?? '—'}
          </Typography>
        </Box>
        {/* Right side: Act button + status in a row, icons below */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-end', sm: 'flex-end' },
            justifyContent: 'center',
            flex: 1,
            minWidth: 0,
            width: { xs: '100%', sm: 'auto' },
            gap: 0.5,
            boxSizing: 'border-box',
          }}
        >
          {/* Act button and status in a row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.5,
              width: '100%',
              mb: 0.5,
            }}
          >
            <Button
              variant="contained"
              onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}
              disabled={isUpdating}
              sx={{
                backgroundColor: '#0B4B66',
                color: 'white',
                textTransform: 'none',
                fontWeight: 700,
                minWidth: 72,
                height: 28,
                borderRadius: 2,
                px: 2,
                mb:1.2
              }}
              endIcon={<KeyboardArrowDownIcon />}
              aria-controls={anchorEl ? `action-menu-${doc.ID}` : undefined}
              aria-haspopup="true"
            >
              {isUpdating ? 'Updating...' : 'Act'}
            </Button>
            <Menu
              id={`action-menu-${doc.ID}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => handleActionSelect('VERIFIED')}>Verify</MenuItem>
              <MenuItem onClick={() => handleActionSelect('REJECTED')}>Reject</MenuItem>
            </Menu>
            {/* Status */}
            {(() => {
              if (localAction === 'VERIFIED') {
                return (
                  <Box sx={verifiedContainerStyle}>
                    <Typography sx={verifiedTextStyle}>Verified</Typography>
                    <Box 
                    sx={verifiedIconBoxStyle}
                      >
                      <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                    </Box>
                  </Box>
                );
              }
              if (localAction === 'REJECTED') {
                return (
                  <Box sx={rejectedContainerStyle}>
                    <Typography sx={rejectedTextStyle}>Rejected</Typography>
                    <Box sx={CancelIconBoxStyle}>
                      <CancelTwoToneIcon sx={{ fontSize: 18 }} />
                    </Box>
                  </Box>
                );
              }
              return (
                <Box sx={PendingContainerStyle}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ ...PendingTextStyle, color: '#ffffffff', textTransform: 'none' }}>
                      Pending
                    </Typography>
                    <Box sx={PendingIconBoxStyle}>
                      <Box component="img" src={searchActivitySvg} alt="pending icon" sx={{ width: 18, height: 18 }} />
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Box>
          {/* View/download icons below */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              mt: 0.5,
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <IconButton
              aria-label="view"
              sx={{ ...documentIconButtonStyle, width: 40, height: 40 }}
              disabled={!fileUrl}
              onClick={() => fileUrl && window.open(fileUrl, '_blank')}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              aria-label="download"
              sx={{ ...documentIconButtonStyle, width: 40, height: 40 }}
              disabled={!fileUrl}
              onClick={() => {
                if (fileUrl) {
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  link.download = doc.DocumentName || 'document';
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                }
              }}
            >
              <FileDownloadOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Helper function to format bytes as human-readable string
 */
const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

/**
 * Helper function to get file size display string
 */
const getFileSizeDisplay = (rawSize: any): string => {
  if (rawSize == null || rawSize === '') return '';
  
  if (typeof rawSize === 'string') {
    const n = Number(rawSize);
    if (!Number.isNaN(n)) return formatBytes(n);
    return rawSize; // already a human-readable string like "12 KB"
  }
  
  return formatBytes(Number(rawSize));
};

/**
 * Helper function to format date as DD/MM/YY
 */
const formatUploadDate = (uploadDate: string | undefined): string => {
  const raw = uploadDate?.split("T")?.[0];
  if (!raw) return "";
  
  const parts = raw.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy.slice(-2)}`;
  }
  
  return raw;
};

/**
 * Helper function to resolve uploader information
 */
const getUploaderInfo = (doc: any, assesseeUser: any) => {
  const uploadedBy = doc.UploadedBy ?? doc.uploadedBy ?? doc.uploader ?? null;
  const userObj = assesseeUser?.data ?? assesseeUser ?? null;
  
  const uploaderRole = userObj?.role ?? (doc.UploadedByRole ?? doc.uploadedByRole ?? doc.uploaderRole ?? null);
  const uploaderName = (
    userObj?.profile?.fullName ?? 
    userObj?.fullName ?? 
    userObj?.username ??
    doc.UploadedByName ?? 
    doc.uploadedByName ?? 
    doc.uploaderName ?? 
    uploadedBy ?? 
    ''
  ).toString();
  
  return { uploaderRole, uploaderName, uploadedBy };
};

/**
 * Type definition for role filter options
 */
type RoleFilter = 'All' | 'Citizen' | 'Agent';

/**
 * Helper function to filter documents by uploader role
 */
const filterDocumentsByRole = (documents: any[], role: RoleFilter, assesseeUser: any): any[] => {
  if (role === 'All') {
    return documents;
  }
  
  return documents.filter((d: any) => {
    // Get uploader info using the same logic as DocumentRow
    const { uploaderRole } = getUploaderInfo(d, assesseeUser);
    
    // Normalize the role for comparison
    const normalizedRole = (uploaderRole ?? '').toString().toUpperCase().trim();
    const targetRole = role.toUpperCase();
    
    // Match the role
    return normalizedRole === targetRole;
  });
};


// Main component for displaying and managing the list of property documents
export default function DocumentsCard({propertyId, assesseeId}: Readonly<{propertyId: string|undefined, assesseeId: string|undefined}>) {
  // State for filtering documents by uploader role
  const [role, setRole] = useState<RoleFilter>("All");
  // Fetch property application data by property ID
  const { data: application, error, isLoading } = useGetApplicationByApplicationIdQuery(`${propertyId}`);
  // fetch assessee user once (if assesseeId provided)
  const { data: assesseeUser } = useGetUserByIdQuery(assesseeId ?? '', { skip: !assesseeId });

  // Show loading, error, or empty state as appropriate
  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', width: '100%', p: 2 }}>
        <Typography>Loading documents...</Typography>
      </Box>
    );
  }

  if (error)
    return <Box sx={{ display: 'grid', width: '100%' }}>Error: {'status' in error ? `${error.status}` : error.message || 'Failed to load property'}</Box>;

  if (!application) {
    return (
      <Box sx={{ display: 'grid', width: '100%', p: 2 }}>
        <Typography>No property found.</Typography>
      </Box>
    );
  }

  // Extract documents array from application data
  const documents = application.data.Property.Documents || [];

  // Filter documents by role selection using helper function
  const filteredDocuments = filterDocumentsByRole(documents, role, assesseeUser);

  // Render the documents card UI, including filter, list, and empty state
  return (
    <Box sx={documentsCardOuterStyle}>
      <Box sx={documentsCardHeaderStyle}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h6" sx={documentsTitleStyle}>
            Documents
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={documentsSubtitleStyle}>
              All Documents in chronological order
            </Typography>
          </Box>
        </Box>
        <Box sx={DropdownStyle}>
          <FormControl size="small" variant="outlined">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={SelectButtonStyle}
              inputProps={{ "aria-label": "role select" }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Citizen">Citizen</MenuItem>
              <MenuItem value="Agent">Agent</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={documentsListStyle}>
        {filteredDocuments.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ ...documentsSubtitleStyle, color: '#666' }}>
              No Documents Uploaded.
            </Typography>
          </Box>
        ) : (
          filteredDocuments.map((doc, i) => (
            <DocumentRow
              key={doc.ID}
              doc={doc}
              isLastRow={i < filteredDocuments.length - 1}
              assesseeUser={assesseeUser}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
