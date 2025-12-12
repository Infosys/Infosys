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
import CheckIcon from '@mui/icons-material/Check';
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
  RightIconStyle,
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
import { useGetUserByIdQuery } from '../../api/documentsApi';
import { useGetFileFromFilestoreQuery } from "../../api/fileStoreApi";
import { useUpdateDocumentActionMutation } from "../../api/documentsApi";
// ...existing code...

// Renders a single document row with actions (view, download, verify, reject) and status display.
function DocumentRow({ doc, isLastRow, assesseeUser }: { doc: any; isLastRow: boolean; assesseeUser?: any }) {
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
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setFileUrl(null);
    };
  }, [fileBlob, isSuccess]);

  // Prefer backend field for uploader, try common variations
  const uploadedBy = doc.UploadedBy ?? doc.uploadedBy ?? doc.uploader ?? null;

  // Normalize assesseeUser shape: some onboarding responses wrap user under `data`, others may return user directly.
  const userObj = assesseeUser?.data ?? assesseeUser ?? null;

  // Resolve role and name from userObj first, then fall back to document fields
  const uploaderRole = userObj?.role ?? (doc.UploadedByRole ?? doc.uploadedByRole ?? doc.uploaderRole ?? null);
  const uploaderName = (
    userObj?.profile?.fullName ?? userObj?.fullName ?? userObj?.username ??
    doc.UploadedByName ?? doc.uploadedByName ?? doc.uploaderName ?? uploadedBy ?? ''
  ).toString();

  // Extract and format the file size for display
  const rawSize = doc.Size ?? doc.size ?? doc.SizeInBytes ?? doc.sizeInBytes ?? doc.FileSize ?? null;
  // Helper to format bytes as human-readable string
  const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };
  // Compute the display string for file size
  const sizeDisplay = (() => {
    if (rawSize == null || rawSize === '') return '';
    if (typeof rawSize === 'string') {
      const n = Number(rawSize);
      if (!Number.isNaN(n)) return formatBytes(n); // string containing bytes number
      return rawSize; // already a human-readable string like "12 KB"
    }
    return formatBytes(Number(rawSize));
  })();


  // Format the upload date as DD/MM/YY
  const formattedDate = (() => {
    const raw = doc?.UploadDate?.split("T")?.[0];
    if (!raw) return "";
    const parts = raw.split("-");
    if (parts.length === 3) {
      const yyyy = parts[0];
      const mm = parts[1];
      const dd = parts[2];
      return `${dd}/${mm}/${yyyy.slice(-2)}`;
    }
    return raw;
  })();

  // Handle verify/reject actions: update UI optimistically, call API, revert on error
  const handleActionSelect = async (action: "VERIFIED" | "REJECTED") => {
    try {
      setAnchorEl(null);
      // Optimistically update UI first
      setLocalAction(action);
      // Call API to persist the change
      await updateDocumentAction({
        documentId: doc.ID,
        action: action
      }).unwrap();
      // Success - localAction already updated optimistically
      console.log(`Document ${doc.ID} action updated to ${action}`);
    } catch (error) {
      // Revert optimistic update on error
      setLocalAction(doc.action ? doc.action.trim().toUpperCase() : "PENDING");
      console.error('Failed to update document action:', error);
      // You could add toast notification here
    }
  };

  return (
    <Box sx={documentRowStyle(isLastRow)}>
      <Box sx={EachDocumentRowStyle}>
        <Box sx={documentIconBoxStyle}>
          <Box component="img" src={taskSvg} alt="document icon" sx={{ width: 38, height: 38 }} />
        </Box>
        <Box sx={documentTextBoxStyle}>
          <Typography sx={documentTitleStyle}>{doc.DocumentType}</Typography>
          <Typography sx={documentMetaStyle}>{doc.DocumentName}</Typography>
          <Typography sx={{ ...documentMetaStyle, mt: 0.5 }}>
            {sizeDisplay ? `${sizeDisplay} · ` : ''}
            Date : {formattedDate}
          </Typography>
          <Typography sx={{ ...documentMetaStyle, mt: 0.5 }}>
            {uploaderRole ? `${uploaderRole} - ` : ''}
            Uploaded by - {(uploaderName && uploaderName.trim()) ? uploaderName : (uploadedBy ?? '—')}
          </Typography>
        </Box>

        <Box sx={RightIconStyle}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Act button: always visible, fixed spacing so status won't push it */}
            <>
              <Button
                variant="contained"
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}
                disabled={isUpdating}
                sx={{
                  mr: 1,                      // fixed right spacing between button and status
                  backgroundColor: '#0B4B66',
                  color: 'white',
                  textTransform: "none",
                  fontWeight: 700,
                  flexShrink: 0,              // prevent the button from being pushed/shrunk
                  minWidth: 72
                }}
                endIcon={<KeyboardArrowDownIcon />}
                aria-controls={Boolean(anchorEl) ? `action-menu-${doc.ID}` : undefined}
                aria-haspopup="true"
              >
                {isUpdating ? "Updating..." : "Act"}
              </Button>
              <Menu
                id={`action-menu-${doc.ID}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleActionSelect("VERIFIED")}>Verify</MenuItem>
                <MenuItem onClick={() => handleActionSelect("REJECTED")}>Reject</MenuItem>
              </Menu>
            </>

            {/* Status: always rendered after Act so it doesn't swap places */}
            {localAction === "VERIFIED" ? (
              <Box sx={verifiedContainerStyle}>
                <Typography sx={verifiedTextStyle}>Verified</Typography>
                <Box sx={verifiedIconBoxStyle}>
                  <CheckIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            ) : localAction === "REJECTED" ? (
              <Box sx={rejectedContainerStyle}>
                <Typography sx={rejectedTextStyle}>Rejected</Typography>
                <Box sx={CancelIconBoxStyle}>
                  <CancelTwoToneIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            ) : (
              <Box sx={PendingContainerStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ ...PendingTextStyle, color: '#ffffffff', textTransform: "none" }}>
                    Pending
                  </Typography>
                  <Box sx={PendingIconBoxStyle}>
                    <Box component="img" src={searchActivitySvg} alt="pending icon" sx={{ width: 18, height: 18 }} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 4, ml: 13 }}>
            <IconButton
              aria-label="view"
              sx={documentIconButtonStyle}
              disabled={!fileUrl}
              onClick={() => fileUrl && window.open(fileUrl, "_blank")}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              aria-label="download"
              sx={documentIconButtonStyle}
              disabled={!fileUrl}
              onClick={() => {
                if (fileUrl) {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = doc.DocumentName || "document";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
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

// Main component for displaying and managing the list of property documents
export default function DocumentsCard({propertyId, assesseeId}: {propertyId: string|undefined, assesseeId: string|undefined}) {
  // State for filtering documents by uploader role
  const [role, setRole] = useState<"All" | "Citizen" | "Agent">("All");
  // Fetch property application data by property ID
  const { data: application, error, isLoading } = useGetApplicationByApplicationIdQuery(`${propertyId}`);
  // fetch assessee user once (if assesseeId provided)
  const { data: assesseeUser } = useGetUserByIdQuery(assesseeId ?? '', { skip: !assesseeId });

  // Show loading, error, or empty state as appropriate
  if (isLoading)
    return <Box sx={{ display: 'grid', width: '100%' }}>Loading...</Box>;

  if (error)
    return <Box sx={{ display: 'grid', width: '100%' }}>Error: {error.toString()}</Box>;

  if (!application)
    return <Box sx={{ display: 'grid', width: '100%' }}>No property found.</Box>;

  // Extract documents array from application data
  const documents = application.data.Property.Documents || [];

  // Filter documents by role selection: if Agent selected, show only docs uploaded by AGENT; if Citizen, show only docs uploaded by CITIZEN.
  const filteredDocuments = role === 'All'
    ? documents
    : documents.filter((d: any) => {
        const roleField = (d.UploadedByRole ?? d.uploadedByRole ?? d.uploaderRole ?? '').toString().toUpperCase();
        const uploadedByField = (d.UploadedBy ?? d.uploadedBy ?? d.uploader ?? '').toString().toUpperCase();
        if (role === 'Agent') return roleField === 'AGENT' || uploadedByField === 'AGENT';
        if (role === 'Citizen') return roleField === 'CITIZEN' || uploadedByField === 'CITIZEN';
        return true;
      });

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
              onChange={(e) => setRole(e.target.value as "All" | "Citizen" | "Agent")}
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
            <Typography variant="body2" sx={documentsSubtitleStyle || { color: '#666' }}>
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
