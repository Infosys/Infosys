// This component displays a timeline of application logs (comments, actions, attachments) for a property application.
// It allows users to add new comments (with optional file attachments) and download attached documents.
// The component uses dialogs for adding comments and confirming submissions, and integrates with API mutations for posting logs and uploading files.
import React from "react";
import { Box, Typography, Button, useMediaQuery, Container } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  containerStyle,
  timelineCircleStyle,
  timelineVerticalBarStyle,
  commentTitleStyle,
  commentTextStyle,
  dateTextStyle,
  addButtonBoxStyle,
  addButtonStyle,
  downloadButtonStyle
} from "../../Styles/searchPropertyStyles/ApplicationTrackStyle";
import RequestDialog from "../property details/addRequestPopUp/addRequestPopUp";
import ConfirmationDialog from "../property details/addRequestPopUp/confirmationPopUp";
import { usePostApplicationLogMutation } from "../../api/applicationApi";
import { useUploadFileToFilestoreMutation } from "../../api/fileStoreApi";
import { useAuth } from "../../../../login-signup/provider/AuthProvider";



// Localization strings for UI labels
const loc = {
  applicationLogTitle: "Track Application",
  addRequestText: "Add Comment",
};


// Type for a single application log entry
interface ApplicationLog {
  Action: string;
  ApplicationID: string;
  Actor : string;
  Comments: string;
  CreatedAt: string;
  FileStoreID: string | null;
  ID: string;
  Metadata: string;
  PerformedBy: string;
  PerformedDate: string;
}


// Props for the ApplicationTrack component
interface ApplicationTrackProps {
  logs: ApplicationLog[]; // List of log entries to display
  timelineBackgroundColor?: string; // Optional color for the timeline bar
  applicationId?: string; // Application ID for posting new logs
}


const ApplicationTrack: React.FC<ApplicationTrackProps> = ({ logs, applicationId, timelineBackgroundColor = "#d0d0d0" }) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:375px)");
  // console.log("user object:", user);

  // Sort logs oldest to newest for timeline display
  const logItems: ApplicationLog[] = (logs ?? []).slice().sort(
    (a, b) => new Date(a.PerformedDate).getTime() - new Date(b.PerformedDate).getTime()
  );

  // Dialog state for add comment and confirmation dialogs
  const [open, setOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [pendingComment, setPendingComment] = React.useState<string | null>(null);
  const [pendingFile, setPendingFile] = React.useState<File | undefined>(undefined);

  // API mutations for posting logs and uploading files
  const [postApplicationLog, { isLoading: isLogLoading }] = usePostApplicationLogMutation();
  const [uploadFileToFilestore, { isLoading: isFileUploading }] = useUploadFileToFilestoreMutation();

  // Open the add comment dialog
  const handleAddComment = () => setOpen(true);
  // Close the add comment dialog
  const handleClose = () => setOpen(false);

  // Called when "Submit" in RequestDialog is clicked (before confirmation dialog)
  const handleRequestSubmit = (comment: string, file?: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    setPendingComment(comment);
    setPendingFile(file);
    setShowSuccess(true);
    setOpen(false);
  };

  // Called after confirmation dialog ("Confirm" is clicked)
  const handleConfirm = async () => {
    try {
      const Id = applicationId || "";
      const performedBy = user?.username || "";
      // console.log("user name :", user?.username);
      // console.log("performedBy:", performedBy);

      let fileStoreId: string | undefined = undefined;

      // If a file is attached, upload it to the filestore first
      if (pendingFile) {
        const uploadResult = await uploadFileToFilestore({ file: pendingFile }).unwrap();
        fileStoreId = uploadResult?.files?.[0]?.fileStoreId;
        console.log("file store id is: ", fileStoreId);
      }
      // console.log("Performed by : ", user?.username);
      
      // 2. Post application log 
      await postApplicationLog({
        action: "CREATE",
        actor: user?.role || "No Role Found",
        performedBy,
        comments: pendingComment || "",
        applicationId: Id,
        fileStoreId: fileStoreId || undefined,
        metadata: {
          userAgent: navigator.userAgent,
          ...(pendingFile ? { file: { name: pendingFile.name } } : {}),
        },
      }).unwrap();
    } catch (err) {
      console.error("Error posting comment", err);
    }
    // console.log("comment submitted: ", pendingComment);

    setShowSuccess(false);
    setPendingComment(null);
    setPendingFile(undefined);
  };

  // Close the confirmation dialog
  const handleSuccessClose = () => {
    setShowSuccess(false);
    setOpen(false);
  };

  // Add this validation function
  function validateFile(file?: File): string | null {
    if (!file) return null;
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, JPEG, and PNG files are allowed.";
    }
    return null;
  }

  return (
    <Container>
      <Box sx={containerStyle(isMobile)}>
        {/* Title for the application log timeline */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {loc.applicationLogTitle}
        </Typography>
      <Box sx={{ maxHeight: '80vh', overflowY: "auto",scrollbarWidth: "none",  overflowX: "hidden", width: "100%", mb: 2 }}>
        {/* Show custom message if no logs */}
        {logItems.length === 0 ? (
          <Typography sx={{ fontSize: 16, color: "#888", mb: 2 }}>
            No Log Found
          </Typography>
        ) : (
          logItems.map((item, idx) => {
            // console.log('FileStoreID:', item.FileStoreID);
            let fileName = "";
            try {
              const meta = item.Metadata ? JSON.parse(item.Metadata) : {};
              fileName = meta.file?.name || "";
            } catch {}
            return (
              <Box key={item.ID} sx={{ display: "flex", mb: 2 }}>
                {/* Timeline marker and vertical bar */}
                <Box
                  sx={{
                    width: "32px",
                    display: "flex",
                    minHeight: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box sx={timelineCircleStyle}>
                    {idx + 1}
                  </Box>
                  {idx !== logItems.length - 1 && (
                    <Box sx={{ ...timelineVerticalBarStyle, background: timelineBackgroundColor }} className="vertical-bar" />
                  )}
                </Box>
                {/* Log details: performer, comment, attachment, date */}
                <Box sx={{ flex: 1, pl: "16px", pt: "2px", minWidth: 0, width: "100%"}}>
                  <Typography sx={commentTitleStyle}>
                    {item.Actor}
                  </Typography>
                  <Typography sx={commentTextStyle}>
                    <strong> {item.PerformedBy}</strong>
                  </Typography>
                  <Typography sx={commentTextStyle}>
                    {item.Comments}
                  </Typography>
                  {/* Show file name if present */}
                  {fileName && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <DescriptionIcon  style={{ fontSize: 24, color: "#888" }} />
                      <Typography sx={{ fontSize: 16, color: "#444", fontWeight: 500 }}>
                        {fileName}
                      </Typography>
                    </Box>
                  )}
                  {/* Always show download button if FileStoreID exists */}
                  {item.FileStoreID && (
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<DownloadIcon style={{ fontSize: 16 }}/>
                      }
                      sx={downloadButtonStyle}
                      onClick={() => {
                        const url = `${import.meta.env.VITE_FILESTORE_HOST}/filestore/v1/files/${item.FileStoreID}?tenantId=pg`;
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = fileName || "Attachment";
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download Doc
                    </Button>
                  )}
                  {/* Show the date of the log entry */}
                  <Typography component="span" sx={dateTextStyle}>
                    {item.PerformedDate.split("T")[0]}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        </Box>
        {/* Add comment button and dialogs */}
        <Box sx={addButtonBoxStyle(isMobile)}>
          <Button
            variant="contained"
            onClick={handleAddComment}
            sx={addButtonStyle}
            disabled={isLogLoading || isFileUploading}
          >
            {loc.addRequestText}
          </Button>
          <RequestDialog
            open={open}
            onClose={handleClose}
            onSubmit={handleRequestSubmit}
          />
          <ConfirmationDialog
            open={showSuccess}
            onClose={handleSuccessClose}
            onReject={handleSuccessClose}
            onConfirm={handleConfirm}
          />
        </Box>
      </Box>
    </Container>
  );
};


// Export the ApplicationTrack component for use in parent components
export default ApplicationTrack;